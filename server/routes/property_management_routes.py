from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from datetime import datetime, timedelta
import uuid
from werkzeug.security import generate_password_hash

from extensions import db
from models import (
    Property, House, Tenant, Landlord, Caretaker, 
    RoleType, HouseStatus, NotificationLog, NotificationChannel, NotificationStatus
)

property_mgmt_bp = Blueprint('property_mgmt', __name__, url_prefix='/api')

def get_authorized_landlord_id():
    """
    Helper to extract the correct landlord_id based on the user's role.
    If a Caretaker makes the request, it routes to their employer's ID.
    """
    claims = get_jwt()
    role = claims.get('role')
    user_id = get_jwt_identity()

    if role == RoleType.LANDLORD.value:
        return user_id
    elif role == RoleType.CARETAKER.value:
        return claims.get('employer_id')
    return None

# ==========================================
# PROPERTIES
# ==========================================

# GET & POST /api/properties
@property_mgmt_bp.route('/properties', methods=['GET', 'POST'])
@jwt_required()
def manage_properties():
    """
    GET: List all properties for the authorized landlord.
    POST: Create a new property entity.
    ---
    tags:
      - Property Management
    security:
      - Bearer: []
    """
    landlord_id = get_authorized_landlord_id()
    if not landlord_id:
        return jsonify({'error': 'Unauthorized role for property management.'}), 403

    if request.method == 'GET':
        properties = Property.query.filter_by(landlord_id=landlord_id, deleted_at=None).all()
        return jsonify({
            'properties': [{
                'id': p.id,
                'name': p.name,
                'location': p.location,
                'description': p.description,
                'created_at': p.created_at.isoformat()
            } for p in properties]
        }), 200

    if request.method == 'POST':
        data = request.get_json()
        if not data.get('name') or not data.get('location'):
            return jsonify({'error': 'Property name and location are required.'}), 400

        new_property = Property(
            landlord_id=landlord_id,
            name=data.get('name'),
            location=data.get('location'),
            description=data.get('description')
        )
        db.session.add(new_property)
        db.session.commit()

        return jsonify({'message': 'Property created successfully.', 'property_id': new_property.id}), 201


# POST /api/properties/<id>/houses
@property_mgmt_bp.route('/properties/<string:property_id>/houses', methods=['POST'])
@jwt_required()
def add_house(property_id):
    """
    Adds a new house to a property, auto-generating the unique prefix.
    ---
    tags:
      - Property Management
    parameters:
      - in: path
        name: property_id
        required: true
        type: string
    """
    landlord_id = get_authorized_landlord_id()
    if not landlord_id:
        return jsonify({'error': 'Unauthorized role.'}), 403

    # Verify property belongs to this landlord
    parent_property = Property.query.filter_by(id=property_id, landlord_id=landlord_id).first()
    if not parent_property:
        return jsonify({'error': 'Property not found or unauthorized.'}), 404

    data = request.get_json()
    unit_number = data.get('house_number') # e.g., "001"
    base_rent = data.get('base_rent')

    if not unit_number or base_rent is None:
        return jsonify({'error': 'house_number suffix and base_rent are required.'}), 400

    # CRUCIAL LOGIC: Auto-generate the unique house prefix
    landlord = db.session.get(Landlord, landlord_id)
    full_house_number = f"{landlord.initials_prefix}-{unit_number}"

    # Check for exact collision within the system
    existing_house = House.query.filter_by(house_number=full_house_number).first()
    if existing_house:
        return jsonify({'error': f'House number {full_house_number} already exists.'}), 409

    new_house = House(
        property_id=parent_property.id,
        house_number=full_house_number,
        base_rent=float(base_rent),
        status=HouseStatus.VACANT
    )
    
    db.session.add(new_house)
    db.session.commit()

    return jsonify({
        'message': 'House added successfully.', 
        'house_number': new_house.house_number
    }), 201


# ==========================================
# TENANTS
# ==========================================

# POST /api/tenants
@property_mgmt_bp.route('/tenants', methods=['POST'])
@jwt_required()
def register_tenant():
    """
    Registers a new tenant, assigns them to a house, and generates a dormant profile.
    ---
    tags:
      - Tenant Management
    """
    landlord_id = get_authorized_landlord_id()
    if not landlord_id:
        return jsonify({'error': 'Unauthorized role.'}), 403

    data = request.get_json()
    house_id = data.get('house_id')

    # Verify the house is Vacant and belongs to this landlord
    house = House.query.join(Property).filter(
        House.id == house_id, 
        Property.landlord_id == landlord_id
    ).first()

    if not house:
        return jsonify({'error': 'House not found or unauthorized.'}), 404
    if house.status != HouseStatus.VACANT:
        return jsonify({'error': 'House is already occupied.'}), 400

    # Generate Dormant Account Profile
    activation_token = str(uuid.uuid4())
    # Temporary random password hash; tenant will overwrite this during activation
    temp_password = generate_password_hash(str(uuid.uuid4())) 

    new_tenant = Tenant(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        email=data.get('email'),
        phone_number=data.get('phone_number'),
        id_number=data.get('id_number'),
        move_in_date=datetime.strptime(data.get('move_in_date'), '%Y-%m-%d').date(),
        deposit_amount=float(data.get('deposit_amount', 0.00)),
        house_id=house.id,
        emergency_contact_name=data.get('emergency_contact_name'),
        emergency_contact_phone=data.get('emergency_contact_phone'),
        password_hash=temp_password,
        activation_token=activation_token,
        activation_token_expiry=datetime.utcnow() + timedelta(days=7),
        is_active=False, # Dormant until they click the SMS link
        is_archived=False
    )

    # Update House Status
    house.status = HouseStatus.OCCUPIED

    db.session.add(new_tenant)
    db.session.commit()

    return jsonify({
        'message': 'Tenant registered successfully. Activation token generated.',
        'tenant_id': new_tenant.id,
        'activation_token': activation_token
    }), 201


# PUT /api/tenants/<id>
@property_mgmt_bp.route('/tenants/<string:tenant_id>', methods=['PUT'])
@jwt_required()
def update_tenant(tenant_id):
    """
    Updates tenant profile details.
    ---
    tags:
      - Tenant Management
    """
    tenant = db.session.get(Tenant, tenant_id)
    if not tenant:
        return jsonify({'error': 'Tenant not found.'}), 404

    data = request.get_json()
    
    if 'phone_number' in data:
        tenant.phone_number = data['phone_number']
    if 'email' in data:
        tenant.email = data['email']
    if 'emergency_contact_name' in data:
        tenant.emergency_contact_name = data['emergency_contact_name']
    if 'emergency_contact_phone' in data:
        tenant.emergency_contact_phone = data['emergency_contact_phone']

    db.session.commit()

    return jsonify({'message': 'Tenant profile updated successfully.'}), 200


# POST /api/tenants/<id>/archive
@property_mgmt_bp.route('/tenants/<string:tenant_id>/archive', methods=['POST'])
@jwt_required()
def archive_tenant(tenant_id):
    """
    Soft-deletes a vacating tenant. Frees up the house while keeping financial history intact.
    ---
    tags:
      - Tenant Management
    """
    tenant = db.session.get(Tenant, tenant_id)
    if not tenant or tenant.is_archived:
        return jsonify({'error': 'Tenant not found or already archived.'}), 404

    data = request.get_json() or {}
    move_out_date_str = data.get('move_out_date')
    
    tenant.is_archived = True
    tenant.is_active = False
    tenant.move_out_date = datetime.strptime(move_out_date_str, '%Y-%m-%d').date() if move_out_date_str else datetime.utcnow().date()

    # Free up the physical unit
    if tenant.house_id:
        house = db.session.get(House, tenant.house_id)
        if house:
            house.status = HouseStatus.VACANT
        tenant.house_id = None # Decouple from unit to prevent future automated billing

    db.session.commit()

    return jsonify({'message': 'Tenant successfully archived. House is now Vacant.'}), 200


# POST /api/tenants/notify-setup
@property_mgmt_bp.route('/tenants/notify-setup', methods=['POST'])
@jwt_required()
def notify_system_setup():
    """
    Triggers a bulk SMS dispatch via Africa's Talking to all active tenants.
    ---
    tags:
      - Tenant Management
      - Notifications
    """
    landlord_id = get_authorized_landlord_id()
    if not landlord_id:
        return jsonify({'error': 'Unauthorized role.'}), 403

    # Find all active (non-archived) tenants for this landlord's properties
    tenants = Tenant.query.join(House).join(Property).filter(
        Property.landlord_id == landlord_id,
        Tenant.is_archived == False
    ).all()

    if not tenants:
        return jsonify({'message': 'No active tenants to notify.'}), 200

    dispatched_count = 0
    for tenant in tenants:
        # NOTE: Implement actual Africa's Talking SMS API call here
        # AT.sms.send(f"Welcome to Sahil Rent Pay...", [tenant.phone_number])
        
        # Log the outbound communication attempt
        log_entry = NotificationLog(
            recipient_id=tenant.id,
            channel=NotificationChannel.SMS,
            template_type='system_setup_welcome',
            status=NotificationStatus.SENT 
        )
        db.session.add(log_entry)
        dispatched_count += 1

    db.session.commit()

    return jsonify({'message': f'Setup notifications dispatched to {dispatched_count} tenants.'}), 200