from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from io import BytesIO
from datetime import date
from sqlalchemy import func

from extensions import db
from models import (
    Tenant, Invoice, InvoiceLineItem, LedgerEntry, RoleType, InvoiceStatus
)
# Note: Assuming you have a utility function for WeasyPrint HTML to PDF conversion
# from utils.pdf_generator import generate_pdf

tenant_portal_bp = Blueprint('tenant_portal', __name__, url_prefix='/api/tenant-portal')


def is_tenant():
    """Helper to verify if the current user is an active Tenant."""
    claims = get_jwt()
    return claims.get('role') == RoleType.TENANT.value


# GET /api/tenant-portal/dashboard
@tenant_portal_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_tenant_dashboard():
    """
    Fetches the tenant's granular rent breakdown (Previous Balance vs. Current Month Dues).
    ---
    tags:
      - Tenant Portal
    security:
      - Bearer: []
    responses:
      200:
        description: Granular breakdown of outstanding balances.
      403:
        description: Unauthorized role.
    """
    if not is_tenant():
        return jsonify({'error': 'Unauthorized. Tenants only.'}), 403

    tenant_id = get_jwt_identity()

    # 1. Calculate Total Ledger Balance
    # Positive amount = credit/payment, Negative amount = deduction/charge
    total_ledger = db.session.query(func.sum(LedgerEntry.amount)).filter_by(user_id=tenant_id).scalar() or 0.0
    
    # 2. Fetch the Current Month's Unpaid/Partial Invoice
    current_month_start = date.today().replace(day=1)
    current_invoice = Invoice.query.filter(
        Invoice.tenant_id == tenant_id,
        Invoice.billing_month >= current_month_start,
        Invoice.status != InvoiceStatus.PAID
    ).first()

    current_dues = []
    current_invoice_total = 0.0

    if current_invoice:
        current_invoice_total = float(current_invoice.total_amount)
        line_items = InvoiceLineItem.query.filter_by(invoice_id=current_invoice.id).all()
        current_dues = [{'category': item.category, 'amount': float(item.amount)} for item in line_items]

    # 3. Calculate Previous Arrears or Advance Wallet
    # If the ledger is negative (they owe money), and we subtract what they owe *this* month...
    # Example: Ledger is -15000. Current invoice is 5000. 
    # Arrears = abs(-15000) - 5000 = 10000
    
    total_owed = abs(total_ledger) if total_ledger < 0 else 0.0
    previous_arrears = max(0.0, total_owed - current_invoice_total)
    
    advance_wallet = total_ledger if total_ledger > 0 else 0.0

    dashboard_data = {
        'total_outstanding': total_owed,
        'advance_wallet': advance_wallet,
        'breakdown': {
            'previous_arrears': previous_arrears,
            'current_month_dues': {
                'invoice_id': current_invoice.id if current_invoice else None,
                'total': current_invoice_total,
                'items': current_dues
            }
        }
    }

    return jsonify(dashboard_data), 200


# GET /api/tenant-portal/history
@tenant_portal_bp.route('/history', methods=['GET'])
@jwt_required()
def get_tenant_history():
    """
    Paginates through all past ledger_entries for the tenant to track payments and charges.
    ---
    tags:
      - Tenant Portal
    security:
      - Bearer: []
    parameters:
      - name: page
        in: query
        type: integer
        default: 1
    responses:
      200:
        description: Paginated list of ledger transactions.
    """
    if not is_tenant():
        return jsonify({'error': 'Unauthorized. Tenants only.'}), 403

    tenant_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)

    history_query = LedgerEntry.query.filter_by(user_id=tenant_id)\
        .order_by(LedgerEntry.created_at.desc())\
        .paginate(page=page, per_page=15)

    history_data = []
    for entry in history_query.items:
        history_data.append({
            'id': entry.id,
            'date': entry.created_at.isoformat(),
            'transaction_type': entry.transaction_type,
            'amount': float(entry.amount),
            'description': entry.description,
            'invoice_id': entry.invoice_id
        })

    return jsonify({
        'history': history_data,
        'total': history_query.total,
        'pages': history_query.pages,
        'current_page': history_query.page
    }), 200


# PUT /api/tenant-portal/profile
@tenant_portal_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_tenant_profile():
    """
    Allows the tenant to update their email/phone for receipt routing.
    ---
    tags:
      - Tenant Portal
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            email:
              type: string
            phone_number:
              type: string
    responses:
      200:
        description: Profile updated successfully.
    """
    if not is_tenant():
        return jsonify({'error': 'Unauthorized. Tenants only.'}), 403

    tenant_id = get_jwt_identity()
    tenant = db.session.get(Tenant, tenant_id)

    data = request.get_json()
    new_email = data.get('email')
    new_phone = data.get('phone_number')

    if new_email:
        # Basic check for existing email (in production, use robust validation)
        if Tenant.query.filter(Tenant.email == new_email, Tenant.id != tenant_id).first():
            return jsonify({'error': 'Email already in use.'}), 400
        tenant.email = new_email

    if new_phone:
        if Tenant.query.filter(Tenant.phone_number == new_phone, Tenant.id != tenant_id).first():
            return jsonify({'error': 'Phone number already in use.'}), 400
        tenant.phone_number = new_phone

    db.session.commit()

    return jsonify({
        'message': 'Profile updated successfully.',
        'email': tenant.email,
        'phone_number': tenant.phone_number
    }), 200


# GET /api/tenant-portal/invoices/<id>/download
@tenant_portal_bp.route('/invoices/<string:invoice_id>/download', methods=['GET'])
@jwt_required()
def download_invoice_pdf(invoice_id):
    """
    Triggers WeasyPrint to generate and return a downloadable PDF of an invoice.
    ---
    tags:
      - Tenant Portal
    security:
      - Bearer: []
    """
    if not is_tenant():
        return jsonify({'error': 'Unauthorized. Tenants only.'}), 403

    tenant_id = get_jwt_identity()
    invoice = Invoice.query.filter_by(id=invoice_id, tenant_id=tenant_id).first()

    if not invoice:
        return jsonify({'error': 'Invoice not found or unauthorized.'}), 404

    # NOTE: Implementation placeholder for WeasyPrint
    # html_content = render_template('pdfs/invoice.html', invoice=invoice)
    # pdf_bytes = generate_pdf(html_content)
    
    # Mocking PDF return for architecture blueprint
    pdf_bytes = b"%PDF-1.4 Mock Invoice Document" 
    
    return send_file(
        BytesIO(pdf_bytes),
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f'Invoice_{invoice.billing_month.strftime("%Y_%m")}.pdf'
    )


# GET /api/tenant-portal/receipts/<id>/download
@tenant_portal_bp.route('/receipts/<string:ledger_entry_id>/download', methods=['GET'])
@jwt_required()
def download_receipt_pdf(ledger_entry_id):
    """
    Triggers WeasyPrint to generate and return a downloadable PDF receipt for a payment.
    ---
    tags:
      - Tenant Portal
    security:
      - Bearer: []
    """
    if not is_tenant():
        return jsonify({'error': 'Unauthorized. Tenants only.'}), 403

    tenant_id = get_jwt_identity()
    
    # Ensure this ledger entry belongs to the tenant and is a positive payment
    payment_entry = LedgerEntry.query.filter(
        LedgerEntry.id == ledger_entry_id,
        LedgerEntry.user_id == tenant_id,
        LedgerEntry.amount > 0 
    ).first()

    if not payment_entry:
        return jsonify({'error': 'Payment receipt not found or unauthorized.'}), 404

    # NOTE: Implementation placeholder for WeasyPrint
    # html_content = render_template('pdfs/receipt.html', entry=payment_entry)
    # pdf_bytes = generate_pdf(html_content)
    
    # Mocking PDF return for architecture blueprint
    pdf_bytes = b"%PDF-1.4 Mock Receipt Document" 
    
    return send_file(
        BytesIO(pdf_bytes),
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f'Receipt_{payment_entry.created_at.strftime("%Y%m%d")}.pdf'
    )