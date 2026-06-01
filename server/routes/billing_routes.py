from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from datetime import datetime, date
import uuid

from extensions import db
from models import (
    ChargeType, PendingCharge, Invoice, InvoiceLineItem, 
    LedgerEntry, Tenant, Property, House, NotificationLog, 
    NotificationChannel, NotificationStatus, RoleType, InvoiceStatus
)

billing_bp = Blueprint('billing', __name__, url_prefix='/api/billing')

def get_authorized_landlord_id():
    """Helper to extract the correct landlord_id based on user role."""
    claims = get_jwt()
    role = claims.get('role')
    if role == RoleType.LANDLORD.value:
        return get_jwt_identity()
    elif role == RoleType.CARETAKER.value:
        return claims.get('employer_id')
    return None

def is_strictly_landlord():
    """Helper to block caretakers from sensitive financial configuration routes."""
    claims = get_jwt()
    return claims.get('role') == RoleType.LANDLORD.value

# GET & POST /api/billing/charge-types
@billing_bp.route('/charge-types', methods=['GET', 'POST'])
@jwt_required()
def manage_charge_types():
    """
    Landlord configuration of reusable custom charges.
    ---
    tags:
      - Billing
    security:
      - Bearer: []
    """
    if not is_strictly_landlord():
        return jsonify({'error': 'Unauthorized. Landlords only.'}), 403

    landlord_id = get_authorized_landlord_id()

    if request.method == 'GET':
        charges = ChargeType.query.filter_by(landlord_id=landlord_id, is_active=True).all()
        return jsonify({
            'charge_types': [{
                'id': c.id,
                'name': c.name,
                'created_at': c.created_at.isoformat()
            } for c in charges]
        }), 200

    if request.method == 'POST':
        data = request.get_json()
        name = data.get('name')

        if not name:
            return jsonify({'error': 'Charge name is required.'}), 400

        new_charge = ChargeType(
            landlord_id=landlord_id,
            name=name
        )
        db.session.add(new_charge)
        db.session.commit()

        return jsonify({'message': 'Charge type created successfully.', 'charge_type_id': new_charge.id}), 201


# POST /api/billing/pending-charges
@billing_bp.route('/pending-charges', methods=['POST'])
@jwt_required()
def add_pending_charge():
    """
    Queue ad-hoc utility readings mid-month (Accessible by Landlord & Caretaker).
    ---
    tags:
      - Billing
    security:
      - Bearer: []
    """
    landlord_id = get_authorized_landlord_id()
    if not landlord_id:
        return jsonify({'error': 'Unauthorized role.'}), 403

    data = request.get_json()
    tenant_id = data.get('tenant_id')
    charge_type_id = data.get('charge_type_id')
    amount = data.get('amount')
    notes = data.get('notes', '')

    if not all([tenant_id, charge_type_id, amount]) or float(amount) <= 0:
        return jsonify({'error': 'Valid tenant_id, charge_type_id, and positive amount are required.'}), 400

    # Verify tenant belongs to this landlord
    tenant = Tenant.query.join(House).join(Property).filter(
        Tenant.id == tenant_id,
        Property.landlord_id == landlord_id
    ).first()

    if not tenant:
        return jsonify({'error': 'Tenant not found or unauthorized.'}), 404

    # Verify charge type belongs to this landlord
    charge_type = ChargeType.query.filter_by(id=charge_type_id, landlord_id=landlord_id, is_active=True).first()
    if not charge_type:
        return jsonify({'error': 'Invalid or unauthorized charge type.'}), 404

    pending_charge = PendingCharge(
        tenant_id=tenant.id,
        charge_type_id=charge_type.id,
        amount=float(amount),
        created_by_id=get_jwt_identity(),
        notes=notes
    )

    db.session.add(pending_charge)
    db.session.commit()

    return jsonify({'message': 'Pending charge queued successfully for next invoice.', 'pending_charge_id': pending_charge.id}), 201


# POST /api/billing/fines/trigger
@billing_bp.route('/fines/trigger', methods=['POST'])
@jwt_required()
def trigger_dynamic_fines():
    """
    Executes the dynamic fine run. Generates standalone fine invoices and triggers SMS.
    ---
    tags:
      - Billing
    security:
      - Bearer: []
    """
    if not is_strictly_landlord():
        return jsonify({'error': 'Unauthorized. Landlords only.'}), 403

    landlord_id = get_authorized_landlord_id()
    data = request.get_json()
    
    tenant_ids = data.get('tenant_ids', []) # List of specific tenants selected in the UI
    amount = data.get('amount')
    description = data.get('description', 'Late Payment Fine')

    if not tenant_ids or not amount or float(amount) <= 0:
        return jsonify({'error': 'tenant_ids array and a positive amount are required.'}), 400

    fines_generated = 0

    for t_id in tenant_ids:
        # Verify tenant scope
        tenant = Tenant.query.join(House).join(Property).filter(
            Tenant.id == t_id, Property.landlord_id == landlord_id
        ).first()

        if not tenant:
            continue

        fine_amount = float(amount)

        # 1. Create Standalone Invoice
        invoice = Invoice(
            tenant_id=tenant.id,
            billing_month=date.today().replace(day=1), # Normalize to current month
            total_amount=fine_amount,
            status=InvoiceStatus.UNPAID,
            is_fine=True
        )
        db.session.add(invoice)
        db.session.flush() # Flush to get invoice.id

        # 2. Add Invoice Line Item
        line_item = InvoiceLineItem(
            invoice_id=invoice.id,
            category=description,
            amount=fine_amount
        )
        db.session.add(line_item)

        # 3. Update the Master Ledger (Negative amount tracks charges)
        ledger_entry = LedgerEntry(
            user_id=tenant.id,
            amount=-abs(fine_amount), 
            transaction_type='Fine',
            invoice_id=invoice.id,
            description=f"Auto-generated fine: {description}"
        )
        db.session.add(ledger_entry)

        # 4. Queue Outbound SMS Notification
        notif_log = NotificationLog(
            recipient_id=tenant.id,
            channel=NotificationChannel.SMS,
            template_type='fine_notice',
            status=NotificationStatus.SENT
        )
        db.session.add(notif_log)
        
        fines_generated += 1

    db.session.commit()

    return jsonify({'message': f'Fines successfully applied and SMS queued for {fines_generated} tenants.'}), 201


# POST /api/billing/manual-adjustments
@billing_bp.route('/manual-adjustments', methods=['POST'])
@jwt_required()
def add_manual_adjustment():
    """
    Manually log "Deposit Held" or "Deposit Refunded" on the master statement.
    ---
    tags:
      - Billing
    security:
      - Bearer: []
    """
    if not is_strictly_landlord():
        return jsonify({'error': 'Unauthorized. Landlords only.'}), 403

    landlord_id = get_authorized_landlord_id()
    data = request.get_json()

    transaction_type = data.get('transaction_type') # e.g., 'Deposit Held', 'Deposit Refunded'
    amount = data.get('amount')
    description = data.get('description')
    
    # Optional: Tie to a specific tenant if provided
    target_user_id = data.get('tenant_id') or landlord_id 

    if not all([transaction_type, amount, description]):
        return jsonify({'error': 'transaction_type, amount, and description are required.'}), 400

    # Business Logic: "Deposit Held" adds funds (Credit), "Deposit Refunded" removes funds (Debit)
    numeric_amount = float(amount)
    if transaction_type.lower() == 'deposit refunded':
        numeric_amount = -abs(numeric_amount)
    else:
        numeric_amount = abs(numeric_amount)

    entry = LedgerEntry(
        user_id=target_user_id,
        amount=numeric_amount,
        transaction_type=transaction_type,
        description=f"[Manual Adjustment]: {description}"
    )

    db.session.add(entry)
    db.session.commit()

    return jsonify({'message': 'Manual adjustment applied successfully to the master ledger.', 'entry_id': entry.id}), 201