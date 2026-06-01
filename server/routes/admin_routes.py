from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from datetime import datetime, timedelta
from extensions import db
from models import (
    User, Landlord, Tenant, Caretaker, House, 
    PlatformSettings, LedgerEntry, AuditLog, RoleType
)

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def admin_required():
    """Helper to verify if the current user is a System Admin."""
    claims = get_jwt()
    return claims.get('role') == RoleType.ADMIN.value

# GET /api/admin/dashboard
@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """
    Fetches the aggregate data table of all landlords, active tenants, and caretakers.
    ---
    tags:
      - Admin
    security:
      - Bearer: []
    responses:
      200:
        description: Master data table listing every registered landlord with statistics.
      403:
        description: Admins only.
    """
    if not admin_required():
        return jsonify({'error': 'Unauthorized. System Admins only.'}), 403

    landlords = Landlord.query.all()
    dashboard_data = []

    for landlord in landlords:
        # Aggregate counts for each landlord [cite: 263]
        total_houses = House.query.join(House.property).filter_by(landlord_id=landlord.id).count()
        total_tenants = Tenant.query.join(Tenant.house).join(House.property).filter_by(landlord_id=landlord.id, is_archived=False).count()
        total_caretakers = Caretaker.query.filter_by(employer_id=landlord.id).count()

        landlord_data = landlord.to_dict()
        landlord_data.update({
            'total_houses': total_houses,
            'total_tenants': total_tenants,
            'total_caretakers': total_caretakers
        })
        dashboard_data.append(landlord_data)

    return jsonify({'landlords': dashboard_data}), 200


# PUT /api/admin/landlords/<id>/processing-fee
@admin_bp.route('/landlords/<string:id>/processing-fee', methods=['PUT'])
@jwt_required()
def update_processing_fee(id):
    """
    Manually override the global default processing fee for a specific landlord.
    ---
    tags:
      - Admin
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            fee:
              type: number
    responses:
      200:
        description: Fee successfully updated.
      403:
        description: Admins only.
      404:
        description: Landlord not found.
    """
    if not admin_required():
        return jsonify({'error': 'Unauthorized. System Admins only.'}), 403

    data = request.get_json()
    new_fee = data.get('fee')

    if new_fee is None or float(new_fee) < 0:
        return jsonify({'error': 'A valid positive fee percentage is required.'}), 400

    landlord = db.session.get(Landlord, id)
    if not landlord:
        return jsonify({'error': 'Landlord not found'}), 404

    landlord.processing_fee = float(new_fee)
    
    # Log the administrative action [cite: 282]
    audit_log = AuditLog(
        actor_id=get_jwt_identity(),
        action="Updated Processing Fee",
        target_id=landlord.id,
        details={"new_fee": new_fee, "landlord_email": landlord.email}
    )
    
    db.session.add(audit_log)
    db.session.commit()

    return jsonify({'message': 'Processing fee updated successfully', 'processing_fee': landlord.processing_fee}), 200


# PUT /api/admin/promotions/global-trial
@admin_bp.route('/promotions/global-trial', methods=['PUT'])
@jwt_required()
def configure_global_trial():
    """
    Toggles the global free trial switch ON/OFF and updates trial_duration_days.
    ---
    tags:
      - Admin
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            trial_is_active:
              type: boolean
            trial_duration_days:
              type: integer
    responses:
      200:
        description: Global promotions updated.
      403:
        description: Admins only.
    """
    if not admin_required():
        return jsonify({'error': 'Unauthorized. System Admins only.'}), 403

    data = request.get_json()
    trial_is_active = data.get('trial_is_active')
    trial_duration_days = data.get('trial_duration_days')

    settings = PlatformSettings.query.first()
    if not settings:
        settings = PlatformSettings(updated_by=get_jwt_identity())
        db.session.add(settings)

    if trial_is_active is not None:
        settings.trial_is_active = trial_is_active
    if trial_duration_days is not None:
        settings.trial_duration_days = int(trial_duration_days)

    settings.updated_by = get_jwt_identity()
    db.session.commit()

    return jsonify({
        'message': 'Global trial settings updated',
        'trial_is_active': settings.trial_is_active,
        'trial_duration_days': settings.trial_duration_days
    }), 200


# PUT /api/admin/landlords/<id>/trial-override
@admin_bp.route('/landlords/<string:id>/trial-override', methods=['PUT'])
@jwt_required()
def override_landlord_trial(id):
    """
    Manually revokes or extends a specific landlord's free trial.
    ---
    tags:
      - Admin
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            is_active:
              type: boolean
            duration_days:
              type: integer
    responses:
      200:
        description: Landlord trial updated.
      404:
        description: Landlord not found.
    """
    if not admin_required():
        return jsonify({'error': 'Unauthorized. System Admins only.'}), 403

    data = request.get_json()
    is_active = data.get('is_active')
    
    landlord = db.session.get(Landlord, id)
    if not landlord:
        return jsonify({'error': 'Landlord not found'}), 404

    settings = PlatformSettings.query.first()
    default_fee = settings.default_processing_fee if settings else 4.00

    if is_active is False:
        # Revoke trial immediately [cite: 303]
        landlord.trial_end_date = datetime.utcnow()
        landlord.processing_fee = default_fee
        action_msg = "Revoked Free Trial"
    elif is_active is True:
        # Extend or grant custom trial [cite: 304]
        duration = data.get('duration_days', 30)
        landlord.trial_end_date = datetime.utcnow() + timedelta(days=int(duration))
        landlord.processing_fee = 0.00
        action_msg = f"Extended Free Trial by {duration} days"
    else:
        return jsonify({'error': 'is_active boolean flag is required'}), 400

    # Log the action
    audit_log = AuditLog(
        actor_id=get_jwt_identity(),
        action=action_msg,
        target_id=landlord.id,
        details={"processing_fee": float(landlord.processing_fee), "trial_end_date": landlord.trial_end_date.isoformat()}
    )
    
    db.session.add(audit_log)
    db.session.commit()

    return jsonify({'message': action_msg, 'landlord': landlord.to_dict()}), 200


# POST /api/admin/ledger/override
@admin_bp.route('/ledger/override', methods=['POST'])
@jwt_required()
def master_ledger_override():
    """
    Master Override allowing Admin to forcefully credit/debit a ledger.
    ---
    tags:
      - Admin
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            user_id:
              type: string
              description: Target user (Tenant or Landlord)
            amount:
              type: number
            description:
              type: string
              description: Mandatory reason for override
    responses:
      201:
        description: Override applied and logged.
      400:
        description: Missing mandatory fields.
    """
    if not admin_required():
        return jsonify({'error': 'Unauthorized. System Admins only.'}), 403

    data = request.get_json()
    target_user_id = data.get('user_id')
    amount = data.get('amount')
    description = data.get('description')

    if not all([target_user_id, amount, description]):
        return jsonify({'error': 'user_id, amount, and description are mandatory.'}), 400

    # Execute the master ledger entry [cite: 284, 285]
    entry = LedgerEntry(
        user_id=target_user_id,
        amount=float(amount),
        transaction_type='Admin Override',
        description=f"[ADMIN OVERRIDE]: {description}"
    )
    db.session.add(entry)

    # Securely log to Audit table [cite: 282, 285]
    audit_log = AuditLog(
        actor_id=get_jwt_identity(),
        action="Master Ledger Override",
        target_id=target_user_id,
        details={"amount_adjusted": float(amount), "reason": description}
    )
    db.session.add(audit_log)
    db.session.commit()

    return jsonify({'message': 'Master override applied successfully.', 'entry_id': entry.id}), 201


# GET /api/admin/audit-logs
@admin_bp.route('/audit-logs', methods=['GET'])
@jwt_required()
def get_audit_logs():
    """
    Fetches the immutable log of system actions for forensic tracking.
    ---
    tags:
      - Admin
    security:
      - Bearer: []
    parameters:
      - name: page
        in: query
        type: integer
    responses:
      200:
        description: Paginated audit logs.
    """
    if not admin_required():
        return jsonify({'error': 'Unauthorized. System Admins only.'}), 403

    page = request.args.get('page', 1, type=int)
    
    logs_query = AuditLog.query.order_by(AuditLog.timestamp.desc()).paginate(page=page, per_page=20)
    
    logs_data = []
    for log in logs_query.items:
        logs_data.append({
            'id': log.id,
            'actor_id': log.actor_id,
            'action': log.action,
            'target_id': log.target_id,
            'details': log.details,
            'timestamp': log.timestamp.isoformat()
        })

    return jsonify({
        'logs': logs_data,
        'total': logs_query.total,
        'pages': logs_query.pages,
        'current_page': logs_query.page
    }), 200