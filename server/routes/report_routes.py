from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from sqlalchemy import func, extract
from datetime import datetime, date

from extensions import db
from models import (
    Tenant, Property, House, Invoice, LedgerEntry, RoleType
)

report_bp = Blueprint('reports', __name__, url_prefix='/api/reports')


def is_strictly_landlord():
    """Helper to enforce that Caretakers cannot access master financial aggregates."""
    claims = get_jwt()
    return claims.get('role') == RoleType.LANDLORD.value


def get_landlord_tenants_subquery(landlord_id):
    """Utility to quickly filter tenants belonging to a specific landlord."""
    return db.session.query(Tenant.id).join(House).join(Property).filter(
        Property.landlord_id == landlord_id
    ).subquery()


# GET /api/reports/current-month
@report_bp.route('/current-month', methods=['GET'])
@jwt_required()
def get_current_month_stats():
    """
    Calculates live expected revenue, collected revenue, and arrears for the main landlord dashboard.
    ---
    tags:
      - Reports & Dashboards
    security:
      - Bearer: []
    responses:
      200:
        description: Current month financial aggregates.
      403:
        description: Unauthorized. Landlords only.
    """
    if not is_strictly_landlord():
        return jsonify({'error': 'Unauthorized. Caretakers cannot view financial aggregates.'}), 403

    landlord_id = get_jwt_identity()
    tenant_subquery = get_landlord_tenants_subquery(landlord_id)
    
    current_year = date.today().year
    current_month = date.today().month
    current_month_start = date(current_year, current_month, 1)

    # 1. Expected Revenue: Sum of all invoices billed this month
    expected_revenue = db.session.query(func.sum(Invoice.total_amount)).filter(
        Invoice.tenant_id.in_(tenant_subquery),
        Invoice.billing_month >= current_month_start
    ).scalar() or 0.0

    # 2. Collected Revenue: Sum of all incoming payments (Ledger entries > 0) this month
    collected_revenue = db.session.query(func.sum(LedgerEntry.amount)).filter(
        LedgerEntry.user_id.in_(tenant_subquery),
        LedgerEntry.amount > 0,
        extract('year', LedgerEntry.created_at) == current_year,
        extract('month', LedgerEntry.created_at) == current_month
    ).scalar() or 0.0

    # 3. Total Arrears: Sum of all negative ledger balances across all tenants
    ledger_balances = db.session.query(
        LedgerEntry.user_id, 
        func.sum(LedgerEntry.amount).label('total_balance')
    ).filter(LedgerEntry.user_id.in_(tenant_subquery)).group_by(LedgerEntry.user_id).all()

    # If balance is negative, it represents arrears/debt
    total_arrears = sum(abs(b.total_balance) for b in ledger_balances if b.total_balance < 0)

    return jsonify({
        'billing_period': current_month_start.strftime('%B %Y'),
        'expected_revenue': float(expected_revenue),
        'collected_revenue': float(collected_revenue),
        'total_arrears': float(total_arrears)
    }), 200


# GET /api/reports/balances
@report_bp.route('/balances', methods=['GET'])
@jwt_required()
def get_tenant_balances():
    """
    Fetches two lists: "Defaulters" (negative ledgers) and "Advance Payments" (positive ledgers).
    ---
    tags:
      - Reports & Dashboards
    security:
      - Bearer: []
    responses:
      200:
        description: Categorized lists of tenant balances.
      403:
        description: Unauthorized.
    """
    if not is_strictly_landlord():
        return jsonify({'error': 'Unauthorized. Caretakers cannot view financial aggregates.'}), 403

    landlord_id = get_jwt_identity()
    tenant_subquery = get_landlord_tenants_subquery(landlord_id)

    # Aggregate the master ledger for every tenant
    ledger_balances = db.session.query(
        LedgerEntry.user_id, 
        func.sum(LedgerEntry.amount).label('total_balance')
    ).filter(LedgerEntry.user_id.in_(tenant_subquery)).group_by(LedgerEntry.user_id).all()

    defaulters = []
    advance_payments = []

    for balance_record in ledger_balances:
        balance = float(balance_record.total_balance)
        if balance == 0:
            continue

        tenant = db.session.get(Tenant, balance_record.user_id)
        if not tenant or tenant.is_archived:
            continue

        house = db.session.get(House, tenant.house_id)
        house_number = house.house_number if house else "Unassigned"

        tenant_data = {
            'tenant_id': tenant.id,
            'name': f"{tenant.first_name} {tenant.last_name}",
            'house_number': house_number,
            'phone_number': tenant.phone_number
        }

        # Negative Ledger = Tenant owes money (Defaulter)
        if balance < 0:
            tenant_data['amount_owed'] = abs(balance)
            defaulters.append(tenant_data)
        # Positive Ledger = Tenant overpaid (Wallet/Advance)
        elif balance > 0:
            tenant_data['advance_balance'] = balance
            advance_payments.append(tenant_data)

    # Sort lists (highest debt first, highest advance first)
    defaulters.sort(key=lambda x: x['amount_owed'], reverse=True)
    advance_payments.sort(key=lambda x: x['advance_balance'], reverse=True)

    return jsonify({
        'defaulters': defaulters,
        'advance_payments': advance_payments,
        'defaulters_count': len(defaulters),
        'advance_payments_count': len(advance_payments)
    }), 200


# GET /api/reports/historical
@report_bp.route('/historical', methods=['GET'])
@jwt_required()
def get_historical_reports():
    """
    Allows the landlord to query past months/years to view aggregated collections and deductions.
    ---
    tags:
      - Reports & Dashboards
    security:
      - Bearer: []
    parameters:
      - name: year
        in: query
        type: integer
        required: true
        description: The year to pull historical data for (e.g., 2026)
    responses:
      200:
        description: Month-by-month aggregated financial data.
      400:
        description: Missing year parameter.
      403:
        description: Unauthorized.
    """
    if not is_strictly_landlord():
        return jsonify({'error': 'Unauthorized. Caretakers cannot view financial aggregates.'}), 403

    year = request.args.get('year', type=int)
    if not year:
        year = date.today().year

    landlord_id = get_jwt_identity()
    tenant_subquery = get_landlord_tenants_subquery(landlord_id)

    # Group collections by month
    monthly_data = db.session.query(
        extract('month', LedgerEntry.created_at).label('month'),
        func.sum(LedgerEntry.amount).label('total_collected')
    ).filter(
        LedgerEntry.user_id.in_(tenant_subquery),
        LedgerEntry.amount > 0, # Only sum positive inflows (payments)
        extract('year', LedgerEntry.created_at) == year
    ).group_by(extract('month', LedgerEntry.created_at)).all()

    # Format the response
    historical_report = []
    for month_index in range(1, 13):
        # Find data for this month if it exists
        month_record = next((item for item in monthly_data if item.month == month_index), None)
        
        historical_report.append({
            'month': datetime(year, month_index, 1).strftime('%B'),
            'month_index': month_index,
            'total_collected': float(month_record.total_collected) if month_record else 0.0
        })

    return jsonify({
        'year': year,
        'historical_data': historical_report
    }), 200