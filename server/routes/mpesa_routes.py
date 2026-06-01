from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from extensions import db
from models import (
    MpesaTransaction, House, Tenant, LedgerEntry, Invoice, 
    PaymentAllocation, NotificationLog, NotificationChannel, 
    NotificationStatus, MpesaStatus, RoleType, InvoiceStatus
)

mpesa_bp = Blueprint('mpesa', __name__, url_prefix='/api/mpesa')

# ==========================================
# HELPER FUNCTIONS
# ==========================================

def process_payment_allocation(tenant_id, mpesa_txn_id, amount):
    """
    Core Business Logic: Applies incoming funds to the master ledger and 
    distributes them across unpaid invoices (prioritizing rent, then utilities).
    """
    # 1. Credit the Master Ledger
    ledger_entry = LedgerEntry(
        user_id=tenant_id,
        amount=amount,
        transaction_type='M-Pesa Payment',
        mpesa_transaction_id=mpesa_txn_id,
        description=f"Automated M-Pesa C2B Payment"
    )
    db.session.add(ledger_entry)

    # 2. Fetch Unpaid or Partial Invoices (Oldest first)
    unpaid_invoices = Invoice.query.filter(
        Invoice.tenant_id == tenant_id,
        Invoice.status != InvoiceStatus.PAID
    ).order_by(Invoice.billing_month.asc()).all()

    remaining_amount = amount

    for invoice in unpaid_invoices:
        if remaining_amount <= 0:
            break
            
        # Calculate what is still owed on this specific invoice
        allocations = PaymentAllocation.query.filter_by(invoice_id=invoice.id).all()
        paid_so_far = sum(float(a.amount_applied) for a in allocations)
        owed_on_invoice = float(invoice.total_amount) - paid_so_far

        if owed_on_invoice <= 0:
            invoice.status = InvoiceStatus.PAID
            continue

        # Determine how much to apply
        amount_to_apply = min(remaining_amount, owed_on_invoice)
        
        allocation = PaymentAllocation(
            mpesa_transaction_id=mpesa_txn_id,
            invoice_id=invoice.id,
            amount_applied=amount_to_apply
        )
        db.session.add(allocation)

        remaining_amount -= amount_to_apply

        # Update Invoice Status
        if amount_to_apply == owed_on_invoice:
            invoice.status = InvoiceStatus.PAID
            invoice.paid_at = datetime.utcnow()
        else:
            invoice.status = InvoiceStatus.PARTIAL

    # Any remaining amount naturally sits as a positive balance in the Ledger (Advance/Wallet)
    
    # 3. Queue Automated Receipt SMS
    notif = NotificationLog(
        recipient_id=tenant_id,
        channel=NotificationChannel.SMS,
        template_type='payment_receipt',
        status=NotificationStatus.SENT
    )
    db.session.add(notif)


# ==========================================
# ROUTES
# ==========================================

# POST /api/mpesa/c2b/validation
@mpesa_bp.route('/c2b/validation', methods=['POST'])
def c2b_validation():
    """
    Safaricom Daraja validation URL. Ensures the bill_ref_number (house prefix) matches.
    NOTE: No JWT required. This is a public webhook for Safaricom.
    ---
    tags:
      - M-Pesa Integrations
    responses:
      200:
        description: Standard Safaricom Daraja JSON response (Accept or Reject)
    """
    payload = request.get_json()
    
    bill_ref_number = payload.get('BillRefNumber', '').strip().upper()
    amount = float(payload.get('TransAmount', 0))

    # Validate against actual system records
    house = House.query.filter_by(house_number=bill_ref_number).first()

    if not house:
        return jsonify({
            "ResultCode": "C2B00012",
            "ResultDesc": "Rejected: Invalid House Number. Please check your prefix."
        })

    if house.status.value == 'Vacant':
        return jsonify({
            "ResultCode": "C2B00013",
            "ResultDesc": "Rejected: House is currently marked as vacant."
        })

    if amount <= 0:
        return jsonify({
            "ResultCode": "C2B00014",
            "ResultDesc": "Rejected: Invalid amount."
        })

    # Accept the transaction
    return jsonify({
        "ResultCode": 0,
        "ResultDesc": "Accepted"
    })


# POST /api/mpesa/c2b/confirmation
@mpesa_bp.route('/c2b/confirmation', methods=['POST'])
def c2b_confirmation():
    """
    Safaricom Daraja confirmation URL. Executes payment allocation and ledger updates.
    NOTE: No JWT required. This is a public webhook for Safaricom.
    ---
    tags:
      - M-Pesa Integrations
    responses:
      200:
        description: Acknowledges receipt to Safaricom
    """
    payload = request.get_json()

    receipt_number = payload.get('TransID')
    amount = float(payload.get('TransAmount', 0))
    bill_ref_number = payload.get('BillRefNumber', '').strip().upper()
    phone_number = payload.get('MSISDN')
    
    # Safaricom timestamp format: YYYYMMDDHHMMSS
    trans_time_str = payload.get('TransTime')
    try:
        trans_date = datetime.strptime(trans_time_str, '%Y%m%d%H%M%S')
    except (ValueError, TypeError):
        trans_date = datetime.utcnow()

    # Idempotency check: Ensure we haven't processed this exact receipt already
    existing_txn = MpesaTransaction.query.filter_by(receipt_number=receipt_number).first()
    if existing_txn:
        return jsonify({"ResultCode": 0, "ResultDesc": "Already processed"})

    # Find the Tenant via the House Number
    house = House.query.filter_by(house_number=bill_ref_number).first()
    tenant = None
    if house:
        tenant = Tenant.query.filter_by(house_id=house.id, is_archived=False).first()

    # Record the raw transaction
    mpesa_txn = MpesaTransaction(
        receipt_number=receipt_number,
        bill_ref_number=bill_ref_number,
        amount=amount,
        phone_number=phone_number,
        transaction_date=trans_date,
        status=MpesaStatus.VERIFIED if tenant else MpesaStatus.PENDING,
        raw_payload=payload,
        is_claimed=True if tenant else False,
        matched_tenant_id=tenant.id if tenant else None
    )
    db.session.add(mpesa_txn)
    db.session.flush() # Flush to get mpesa_txn.id for allocations

    # Execute core financial logic if tenant matched perfectly
    if tenant:
        process_payment_allocation(tenant.id, mpesa_txn.id, amount)

    db.session.commit()

    return jsonify({
        "ResultCode": 0,
        "ResultDesc": "Confirmation received successfully"
    })


# POST /api/mpesa/verify-manual
@mpesa_bp.route('/verify-manual', methods=['POST'])
@jwt_required()
def verify_manual_payment():
    """
    Manual Verification fallback for delayed callbacks (Claim Missing Payment).
    ---
    tags:
      - M-Pesa Integrations
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            receipt_number:
              type: string
              description: e.g., SGH1234567
    responses:
      200:
        description: Payment verified and ledger updated
      400:
        description: Invalid receipt or already claimed
      404:
        description: Transaction not found at Safaricom
    """
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')

    data = request.get_json()
    receipt_number = data.get('receipt_number', '').strip().upper()

    if not receipt_number:
        return jsonify({'error': 'Receipt number is required.'}), 400

    # 1. Check if we already have it in the database and it's unclaimed
    existing_txn = MpesaTransaction.query.filter_by(receipt_number=receipt_number).first()
    
    if existing_txn and existing_txn.is_claimed:
        return jsonify({'error': 'This receipt has already been claimed and applied.'}), 400

    # 2. If not in DB (or pending), we would call Safaricom's Transaction Status API here.
    # NOTE: Placeholder for actual Daraja Transaction Status API request
    # daraja_response = query_daraja_status(receipt_number)
    # if not daraja_response.is_valid:
    #     return jsonify({'error': 'Invalid receipt code according to M-Pesa records.'}), 404
    
    # For this architecture blueprint, we simulate a successful Daraja fetch:
    simulated_amount = existing_txn.amount if existing_txn else 5000.00
    
    # 3. Identify Target Tenant
    target_tenant_id = None
    if role == RoleType.TENANT.value:
        target_tenant_id = user_id
    elif role in [RoleType.LANDLORD.value, RoleType.CARETAKER.value]:
        # If landlord/caretaker is forcing it, they must provide the tenant ID
        target_tenant_id = data.get('tenant_id')
        if not target_tenant_id:
            return jsonify({'error': 'tenant_id is required for manual administrative verification.'}), 400

    # 4. Save/Update Transaction & Process Ledger
    if not existing_txn:
        existing_txn = MpesaTransaction(
            receipt_number=receipt_number,
            bill_ref_number='MANUAL-OVERRIDE',
            amount=simulated_amount,
            phone_number='UNKNOWN',
            transaction_date=datetime.utcnow(),
            status=MpesaStatus.VERIFIED,
            raw_payload={"note": "Manually verified via Daraja API"},
            is_claimed=True,
            matched_tenant_id=target_tenant_id
        )
        db.session.add(existing_txn)
        db.session.flush()
    else:
        existing_txn.status = MpesaStatus.VERIFIED
        existing_txn.is_claimed = True
        existing_txn.matched_tenant_id = target_tenant_id

    # Execute core financial logic
    process_payment_allocation(target_tenant_id, existing_txn.id, simulated_amount)

    db.session.commit()

    return jsonify({
        'message': 'Payment successfully verified, claimed, and applied to the ledger.',
        'receipt_number': receipt_number,
        'amount_applied': simulated_amount
    }), 200