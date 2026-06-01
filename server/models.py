import uuid
import enum
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import CheckConstraint

# Assuming db is initialized via Flask-SQLAlchemy
from extensions import db

# ==========================================
# ENUMS
# ==========================================

class RoleType(enum.Enum):
    ADMIN = "admin"
    LANDLORD = "landlord"
    CARETAKER = "caretaker"
    TENANT = "tenant"

class HouseStatus(enum.Enum):
    VACANT = "Vacant"
    OCCUPIED = "Occupied"

class InvoiceStatus(enum.Enum):
    UNPAID = "Unpaid"
    PARTIAL = "Partial"
    PAID = "Paid"

class MpesaStatus(enum.Enum):
    PENDING = "Pending"
    VERIFIED = "Verified"
    FAILED = "Failed"

class NotificationChannel(enum.Enum):
    SMS = "SMS"
    EMAIL = "Email"

class NotificationStatus(enum.Enum):
    SENT = "Sent"
    DELIVERED = "Delivered"
    FAILED = "Failed"


# ==========================================
# 1. CORE IDENTITY & AUTHENTICATION
# ==========================================

class User(db.Model):
    """Acts as the central identity registry for every entity accessing the platform[cite: 7]."""
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    phone_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role_type = db.Column(db.Enum(RoleType), nullable=False, index=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Standard Timestamps & Soft Delete
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True, index=True)

    __mapper_args__ = {
        'polymorphic_on': role_type,
        'polymorphic_identity': 'user'
    }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone_number': self.phone_number,
            'role_type': self.role_type.value,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Landlord(User):
    """Inherits from users to store core configuration and banking endpoints[cite: 13]."""
    __tablename__ = 'landlords'

    id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    bank_name = db.Column(db.String(100), nullable=True)
    bank_account_number = db.Column(db.String(50), nullable=True)
    account_name = db.Column(db.String(150), nullable=True)
    mpesa_paybill_number = db.Column(db.String(50), nullable=True)
    processing_fee = db.Column(db.Numeric(5, 2), default=4.00, nullable=False)
    trial_end_date = db.Column(db.DateTime, nullable=False, index=True)
    initials_prefix = db.Column(db.String(10), unique=True, nullable=False, index=True)

    __mapper_args__ = {'polymorphic_identity': RoleType.LANDLORD}
    __table_args__ = (
        CheckConstraint('processing_fee >= 0', name='check_positive_processing_fee'),
    )

    properties = db.relationship('Property', backref='landlord', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        data = super().to_dict()
        data.update({
            'bank_name': self.bank_name,
            'processing_fee': float(self.processing_fee),
            'trial_end_date': self.trial_end_date.isoformat(),
            'initials_prefix': self.initials_prefix
        })
        return data

class Tenant(User):
    """Binds an individual customer to a specific physical unit[cite: 18]."""
    __tablename__ = 'tenants'

    id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    id_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    move_in_date = db.Column(db.Date, nullable=False)
    move_out_date = db.Column(db.Date, nullable=True)
    deposit_amount = db.Column(db.Numeric(12, 2), default=0.00, nullable=False)
    house_id = db.Column(db.String(36), db.ForeignKey('houses.id', ondelete='SET NULL'), nullable=True, index=True)
    emergency_contact_name = db.Column(db.String(150), nullable=True)
    emergency_contact_phone = db.Column(db.String(20), nullable=True)
    is_archived = db.Column(db.Boolean, default=False, nullable=False, index=True)
    activation_token = db.Column(db.String(255), unique=True, nullable=True)
    activation_token_expiry = db.Column(db.DateTime, nullable=True)

    __mapper_args__ = {'polymorphic_identity': RoleType.TENANT}
    __table_args__ = (
        CheckConstraint('deposit_amount >= 0', name='check_positive_deposit'),
        CheckConstraint('move_out_date >= move_in_date', name='check_logical_dates'),
    )

    invoices = db.relationship('Invoice', backref='tenant', lazy=True)

class Caretaker(User):
    """Implements strict role delegation to grant property managers operations-focused access[cite: 23]."""
    __tablename__ = 'caretakers'

    id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    employer_id = db.Column(db.String(36), db.ForeignKey('landlords.id', ondelete='CASCADE'), nullable=False, index=True)
    permissions = db.Column(JSONB, default=lambda: {}, nullable=False)

    __mapper_args__ = {'polymorphic_identity': RoleType.CARETAKER}

    employer = db.relationship('Landlord', foreign_keys=[employer_id], backref='caretakers')

class SystemAdmin(User):
    """Provides platform-wide management capabilities[cite: 28]."""
    __tablename__ = 'system_admins'

    id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    access_level = db.Column(db.String(50), nullable=False)

    __mapper_args__ = {'polymorphic_identity': RoleType.ADMIN}


# ==========================================
# 2. PROPERTY & INFRASTRUCTURE
# ==========================================

class Property(db.Model):
    """Groups multiple individual houses under a unified geographical or branded property entity[cite: 34]."""
    __tablename__ = 'properties'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    landlord_id = db.Column(db.String(36), db.ForeignKey('landlords.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(db.String(150), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True, index=True)

    houses = db.relationship('House', backref='property', lazy=True, cascade='all, delete-orphan')

class House(db.Model):
    """Maps individual units to record vacancy rates and define recurring monthly rent prices[cite: 38]."""
    __tablename__ = 'houses'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = db.Column(db.String(36), db.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, index=True)
    house_number = db.Column(db.String(50), nullable=False, index=True)
    base_rent = db.Column(db.Numeric(12, 2), nullable=False)
    status = db.Column(db.Enum(HouseStatus), default=HouseStatus.VACANT, nullable=False, index=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True, index=True)

    __table_args__ = (
        CheckConstraint('base_rent >= 0', name='check_positive_base_rent'),
    )


# ==========================================
# 3. BILLING & INVOICING ENGINE
# ==========================================

class ChargeType(db.Model):
    """Provides a reusable catalog of billing types customized per landlord[cite: 44]."""
    __tablename__ = 'charge_types'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    landlord_id = db.Column(db.String(36), db.ForeignKey('landlords.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True, index=True)

class PendingCharge(db.Model):
    """Acts as a holding queue where managers log utility readings mid-month[cite: 48]."""
    __tablename__ = 'pending_charges'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = db.Column(db.String(36), db.ForeignKey('tenants.id', ondelete='CASCADE'), nullable=False, index=True)
    charge_type_id = db.Column(db.String(36), db.ForeignKey('charge_types.id', ondelete='RESTRICT'), nullable=False, index=True)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    is_invoiced = db.Column(db.Boolean, default=False, nullable=False, index=True)
    created_by_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    notes = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True, index=True)

    __table_args__ = (
        CheckConstraint('amount >= 0', name='check_positive_charge_amount'),
    )

class Invoice(db.Model):
    """The master record for a tenant statement[cite: 52]."""
    __tablename__ = 'invoices'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = db.Column(db.String(36), db.ForeignKey('tenants.id', ondelete='CASCADE'), nullable=False, index=True)
    invoice_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    billing_month = db.Column(db.Date, nullable=False, index=True)
    total_amount = db.Column(db.Numeric(12, 2), nullable=False)
    status = db.Column(db.Enum(InvoiceStatus), default=InvoiceStatus.UNPAID, nullable=False, index=True)
    is_fine = db.Column(db.Boolean, default=False, nullable=False)
    paid_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True, index=True)

    line_items = db.relationship('InvoiceLineItem', backref='invoice', lazy=True, cascade='all, delete-orphan')

    __table_args__ = (
        CheckConstraint('total_amount >= 0', name='check_positive_invoice_total'),
    )

class InvoiceLineItem(db.Model):
    """Provides granular itemization of an invoice[cite: 56]."""
    __tablename__ = 'invoice_line_items'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    invoice_id = db.Column(db.String(36), db.ForeignKey('invoices.id', ondelete='CASCADE'), nullable=False, index=True)
    category = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Numeric(12, 2), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True, index=True)


# ==========================================
# 4. M-PESA TRANSACTION LANDING PAD
# ==========================================

class MpesaTransaction(db.Model):
    """Stores raw callback data received from Safaricom's Daraja API[cite: 62]."""
    __tablename__ = 'mpesa_transactions'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    receipt_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    bill_ref_number = db.Column(db.String(50), nullable=False, index=True)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    transaction_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.Enum(MpesaStatus), default=MpesaStatus.PENDING, nullable=False, index=True)
    raw_payload = db.Column(JSONB, nullable=False)
    is_claimed = db.Column(db.Boolean, default=False, nullable=False, index=True)
    matched_tenant_id = db.Column(db.String(36), db.ForeignKey('tenants.id', ondelete='SET NULL'), nullable=True, index=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True, index=True)

    __table_args__ = (
        CheckConstraint('amount > 0', name='check_positive_mpesa_amount'),
    )


# ==========================================
# 5. INTERNAL FINANCIAL LEDGER & GOVERNANCE
# ==========================================

class LedgerEntry(db.Model):
    """The single source of financial truth. Append-only[cite: 68]."""
    __tablename__ = 'ledger_entries'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='RESTRICT'), nullable=False, index=True)
    amount = db.Column(db.Numeric(12, 2), nullable=False) # Can be negative for charges, positive for payments [cite: 72]
    transaction_type = db.Column(db.String(50), nullable=False, index=True)
    mpesa_transaction_id = db.Column(db.String(36), db.ForeignKey('mpesa_transactions.id', ondelete='SET NULL'), nullable=True)
    invoice_id = db.Column(db.String(36), db.ForeignKey('invoices.id', ondelete='SET NULL'), nullable=True)
    description = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    deleted_at = db.Column(db.DateTime, nullable=True, index=True)

class AuditLog(db.Model):
    """Records administrative actions across the system[cite: 74]."""
    __tablename__ = 'audit_logs'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='RESTRICT'), nullable=False, index=True)
    action = db.Column(db.String(100), nullable=False, index=True)
    target_id = db.Column(db.String(100), nullable=False)
    details = db.Column(JSONB, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)


# ==========================================
# 6. SYSTEM INTEGRATION TABLES
# ==========================================

class PlatformSettings(db.Model):
    """Stores global platform settings in a single-row configuration table[cite: 80]."""
    __tablename__ = 'platform_settings'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    default_processing_fee = db.Column(db.Numeric(5, 2), default=4.00, nullable=False)
    trial_is_active = db.Column(db.Boolean, default=True, nullable=False)
    trial_duration_days = db.Column(db.Integer, default=30, nullable=False)
    updated_by = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='RESTRICT'), nullable=False)
    
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True, index=True)

    __table_args__ = (
        CheckConstraint('default_processing_fee >= 0', name='check_positive_default_fee'),
        CheckConstraint('trial_duration_days >= 0', name='check_positive_trial_days'),
    )

class NotificationLog(db.Model):
    """Tracks outbound communication history across SMS and email[cite: 90]."""
    __tablename__ = 'notification_logs'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    recipient_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    channel = db.Column(db.Enum(NotificationChannel), nullable=False, index=True)
    template_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.Enum(NotificationStatus), default=NotificationStatus.SENT, nullable=False, index=True)
    provider_message_id = db.Column(db.String(255), nullable=True)
    
    sent_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    delivered_at = db.Column(db.DateTime, nullable=True)
    deleted_at = db.Column(db.DateTime, nullable=True, index=True)

class PaymentAllocation(db.Model):
    """Connects incoming transactions to their respective invoices[cite: 94]."""
    __tablename__ = 'payment_allocations'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    mpesa_transaction_id = db.Column(db.String(36), db.ForeignKey('mpesa_transactions.id', ondelete='RESTRICT'), nullable=False, index=True)
    invoice_id = db.Column(db.String(36), db.ForeignKey('invoices.id', ondelete='RESTRICT'), nullable=False, index=True)
    amount_applied = db.Column(db.Numeric(12, 2), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True, index=True)

    __table_args__ = (
        CheckConstraint('amount_applied > 0', name='check_positive_allocation'),
    )