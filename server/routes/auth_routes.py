from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from datetime import datetime
import uuid
from extensions import db
from models import User, Tenant, Landlord, AuditLog, RoleType

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def admin_required():
    claims = get_jwt()
    return claims.get('role') == RoleType.ADMIN.value

# POST /api/auth/login
@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Standard login for Admins, Landlords, Caretakers, and activated Tenants
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            email:
              type: string
              description: User's email (can also adapt to phone_number)
            password:
              type: string
    responses:
      200:
        description: Login successful, returns JWT and user profile
      401:
        description: Invalid credentials
      403:
        description: Account deactivated
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    if not user.is_active:
        return jsonify({'error': 'Account is suspended or deactivated. Contact support.'}), 403

    # Generate JWT with specific role claims for frontend routing
    additional_claims = {
        'role': user.role_type.value,
        'first_name': user.first_name,
        'last_name': user.last_name
    }
    
    # If it's a caretaker, we might want to include the employer_id in the token for easy queries
    if user.role_type == RoleType.CARETAKER:
        additional_claims['employer_id'] = user.employer_id

    access_token = create_access_token(identity=user.id, additional_claims=additional_claims)

    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200


# GET /api/auth/tenant/verify-token
@auth_bp.route('/tenant/verify-token', methods=['GET'])
def verify_tenant_token():
    """
    Validates the tokenized SMS link for a tenant.
    ---
    tags:
      - Authentication
    parameters:
      - name: token
        in: query
        type: string
        required: true
        description: The unique activation token sent via SMS
    responses:
      200:
        description: Returns routing directive (activation vs login)
      400:
        description: Token missing
      404:
        description: Invalid or expired token
    """
    token = request.args.get('token')
    
    if not token:
        return jsonify({'error': 'Activation token is required'}), 400

    tenant = Tenant.query.filter_by(activation_token=token).first()

    if not tenant:
        return jsonify({'error': 'Invalid activation token'}), 404

    # Check if the token has expired
    if tenant.activation_token_expiry and datetime.utcnow() > tenant.activation_token_expiry:
        return jsonify({'error': 'Token has expired. Please request a new one.'}), 400

    # Smart Routing Logic
    if tenant.password_hash:
        # Tenant has already activated their account; route to standard login
        return jsonify({
            'status': 'active',
            'action': 'route_to_login',
            'email': tenant.email,
            'message': 'Account already active. Please log in.'
        }), 200
    else:
        # Tenant has no password; route to activation screen
        return jsonify({
            'status': 'dormant',
            'action': 'route_to_activation',
            'tenant_id': tenant.id,
            'message': 'Token verified. Proceed to set password.'
        }), 200


# POST /api/auth/tenant/activate
@auth_bp.route('/tenant/activate', methods=['POST'])
def activate_tenant():
    """
    First-time tenant activation setting the initial password.
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            token:
              type: string
            password:
              type: string
    responses:
      200:
        description: Account activated successfully, returns JWT
      400:
        description: Invalid token or expired
    """
    data = request.get_json()
    token = data.get('token')
    password = data.get('password')

    if not token or not password:
        return jsonify({'error': 'Token and password are required'}), 400

    tenant = Tenant.query.filter_by(activation_token=token).first()

    if not tenant:
        return jsonify({'error': 'Invalid or expired token'}), 404

    if tenant.activation_token_expiry and datetime.utcnow() > tenant.activation_token_expiry:
        return jsonify({'error': 'Token has expired.'}), 400

    # Set password, clear token, activate user
    tenant.set_password(password)
    tenant.activation_token = None
    tenant.activation_token_expiry = None
    tenant.is_active = True
    
    db.session.commit()

    # Generate initial JWT so the user doesn't have to log in immediately
    additional_claims = {
        'role': tenant.role_type.value,
        'first_name': tenant.first_name,
        'last_name': tenant.last_name
    }
    access_token = create_access_token(identity=tenant.id, additional_claims=additional_claims)

    return jsonify({
        'message': 'Account successfully activated',
        'access_token': access_token,
        'user': tenant.to_dict()
    }), 200


# POST /api/auth/impersonate
@auth_bp.route('/impersonate', methods=['POST'])
@jwt_required()
def impersonate_landlord():
    """
    System Admin specific route to impersonate a landlord for onboarding.
    ---
    tags:
      - Admin
      - Authentication
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            landlord_id:
              type: string
    responses:
      200:
        description: Returns a temporary landlord-scoped JWT
      403:
        description: Admins only
      404:
        description: Landlord not found
    """
    if not admin_required():
        return jsonify({'error': 'Unauthorized. System Admins only.'}), 403

    admin_id = get_jwt_identity()
    data = request.get_json()
    landlord_id = data.get('landlord_id')

    if not landlord_id:
        return jsonify({'error': 'Landlord ID is required'}), 400

    landlord = Landlord.query.get(landlord_id)
    if not landlord:
        return jsonify({'error': 'Landlord not found'}), 404

    # Generate a JWT acting exactly like the landlord
    additional_claims = {
        'role': RoleType.LANDLORD.value,
        'first_name': landlord.first_name,
        'last_name': landlord.last_name,
        'is_impersonated': True,
        'impersonator_id': admin_id
    }
    
    access_token = create_access_token(identity=landlord.id, additional_claims=additional_claims)

    # Log this highly sensitive action in the audit logs
    audit_log = AuditLog(
        actor_id=admin_id,
        action="Impersonated Landlord",
        target_id=landlord.id,
        details={
            "message": f"Admin {admin_id} initiated impersonation session for Landlord {landlord.id}",
            "landlord_email": landlord.email
        }
    )
    db.session.add(audit_log)
    db.session.commit()

    return jsonify({
        'message': f'Now impersonating landlord: {landlord.first_name} {landlord.last_name}',
        'access_token': access_token,
        'landlord': landlord.to_dict()
    }), 200