from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from extensions import db
from models import User, Caretaker, Property, House, Tenant, RoleType
from werkzeug.security import generate_password_hash

caretaker_bp = Blueprint('caretaker', __name__, url_prefix='/api/caretakers')


def is_landlord():
    """Helper to verify if the current user is a Landlord."""
    claims = get_jwt()
    return claims.get('role') == RoleType.LANDLORD.value

def is_caretaker():
    """Helper to verify if the current user is a Caretaker."""
    claims = get_jwt()
    return claims.get('role') == RoleType.CARETAKER.value


# POST /api/caretakers - Landlords only
@caretaker_bp.route('', methods=['POST'])
@jwt_required()
def provision_caretaker():
    """
    Landlord provisions a new caretaker account, assigning specific JSONB permissions.
    ---
    tags:
      - Caretaker Operations
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            first_name:
              type: string
            last_name:
              type: string
            email:
              type: string
            phone_number:
              type: string
            password:
              type: string
            permissions:
              type: object
              description: 'JSONB object for granular access (e.g., {"manage_houses": true, "view_balances": false})'
    responses:
      201:
        description: Caretaker successfully provisioned
      400:
        description: Missing required fields or duplicate user
      403:
        description: Unauthorized. Landlords only.
    """
    if not is_landlord():
        return jsonify({'error': 'Unauthorized. Only landlords can provision caretakers.'}), 403

    landlord_id = get_jwt_identity()
    data = request.get_json()

    # Extract fields
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    phone_number = data.get('phone_number')
    password = data.get('password')
    permissions = data.get('permissions', {})

    if not all([first_name, last_name, email, phone_number, password]):
        return jsonify({'error': 'All personal fields and password are required.'}), 400

    # Check for existing email or phone
    existing_user = User.query.filter((User.email == email) | (User.phone_number == phone_number)).first()
    if existing_user:
        return jsonify({'error': 'A user with this email or phone number already exists.'}), 400

    # Create new caretaker linked to the landlord
    new_caretaker = Caretaker(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone_number=phone_number,
        password_hash=generate_password_hash(password),
        role_type=RoleType.CARETAKER,
        employer_id=landlord_id,
        permissions=permissions
    )

    db.session.add(new_caretaker)
    db.session.commit()

    return jsonify({
        'message': 'Caretaker provisioned successfully.',
        'caretaker': {
            'id': new_caretaker.id,
            'email': new_caretaker.email,
            'permissions': new_caretaker.permissions
        }
    }), 201


# GET /api/caretakers/dashboard - Caretakers only
@caretaker_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_caretaker_dashboard():
    """
    A highly restricted endpoint serving only the properties, houses, and tenants 
    the caretaker is authorized to view. Strict Backend Rule: Blocks financial aggregates.
    ---
    tags:
      - Caretaker Operations
    security:
      - Bearer: []
    responses:
      200:
        description: Operational dashboard data for the caretaker
      403:
        description: Unauthorized role
    """
    if not is_caretaker():
        return jsonify({'error': 'Unauthorized. Caretakers only. Financial aggregate access is strictly forbidden.'}), 403

    claims = get_jwt()
    employer_id = claims.get('employer_id')

    if not employer_id:
        return jsonify({'error': 'Invalid caretaker account. No employer linked.'}), 400

    # Fetch ONLY the properties belonging to the hiring landlord
    properties = Property.query.filter_by(landlord_id=employer_id, deleted_at=None).all()
    
    dashboard_data = {
        'properties': [],
        'total_vacant_houses': 0,
        'total_active_tenants': 0
    }

    for prop in properties:
        # Fetch houses for this property
        houses = House.query.filter_by(property_id=prop.id, deleted_at=None).all()
        prop_data = {
            'id': prop.id,
            'name': prop.name,
            'location': prop.location,
            'houses': []
        }

        for house in houses:
            # Aggregate house operational data (No base_rent or financial configurations exposed)
            house_data = {
                'id': house.id,
                'house_number': house.house_number,
                'status': house.status.value,
                'tenant': None
            }

            if house.status.value == 'Vacant':
                dashboard_data['total_vacant_houses'] += 1

            # If occupied, fetch active tenant operational data
            tenant = Tenant.query.filter_by(house_id=house.id, is_archived=False).first()
            if tenant:
                house_data['tenant'] = {
                    'id': tenant.id,
                    'name': f"{tenant.first_name} {tenant.last_name}",
                    'phone_number': tenant.phone_number
                }
                dashboard_data['total_active_tenants'] += 1

            prop_data['houses'].append(house_data)
        
        dashboard_data['properties'].append(prop_data)

    return jsonify(dashboard_data), 200