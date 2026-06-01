import uuid
from datetime import datetime, date, timedelta
from werkzeug.security import generate_password_hash

# Import your app factory and database
from app import create_app
from extensions import db

# Import all models and Enums
from models import (
    User, SystemAdmin, Landlord, Caretaker, Tenant, Property, House,
    ChargeType, PendingCharge, Invoice, InvoiceLineItem, MpesaTransaction,
    LedgerEntry, AuditLog, PlatformSettings, NotificationLog, PaymentAllocation,
    RoleType, HouseStatus, InvoiceStatus, MpesaStatus, NotificationChannel, NotificationStatus
)

def seed_database():
    app = create_app()
    with app.app_context():
        print("🔴 Dropping all existing tables to ensure a clean slate...")
        db.drop_all()
        
        print("🟢 Creating all tables from models.py...")
        db.create_all()

        print("⚙️  Seeding Platform Settings...")
        settings = PlatformSettings(
            default_processing_fee=4.00,
            trial_is_active=True,
            trial_duration_days=30,
            updated_by="system_initialization"
        )
        db.session.add(settings)
        db.session.commit()

        # ==========================================
        # 1. CREATE USERS (Admin, Landlords, Caretaker)
        # ==========================================
        print("👤 Seeding Users & Roles...")
        
        # System Admin
        admin = SystemAdmin(
            first_name="Super",
            last_name="Admin",
            email="admin@sahil.com",
            phone_number="+254700000000",
            password_hash=generate_password_hash("password123"),
            access_level="Master",
            is_active=True
        )
        db.session.add(admin)

        # Landlord 1: Standard Landlord
        landlord_1 = Landlord(
            first_name="Joseph",
            last_name="Kamau",
            email="joseph@sahil.com",
            phone_number="+254711111111",
            password_hash=generate_password_hash("password123"),
            bank_name="Equity Bank",
            bank_account_number="0123456789",
            account_name="Joseph Kamau Properties",
            initials_prefix="JK",
            trial_end_date=datetime.utcnow() + timedelta(days=15),
            is_active=True
        )
        db.session.add(landlord_1)

        # Landlord 2: Trial Expired (To test Cron Jobs & Default Fees)
        landlord_2 = Landlord(
            first_name="Mary",
            last_name="Wanjiku",
            email="mary@sahil.com",
            phone_number="+254722222222",
            password_hash=generate_password_hash("password123"),
            bank_name="KCB Bank",
            initials_prefix="MW",
            trial_end_date=datetime.utcnow() - timedelta(days=5), # Expired 5 days ago
            processing_fee=0.00, # Setup for the cron job to catch and change to 4.00
            is_active=True
        )
        db.session.add(landlord_2)
        db.session.flush() # Flush to get IDs

        # Caretaker (Assigned to Joseph Kamau)
        caretaker = Caretaker(
            first_name="John",
            last_name="Doe",
            email="caretaker@sahil.com",
            phone_number="+254733333333",
            password_hash=generate_password_hash("password123"),
            employer_id=landlord_1.id,
            permissions={"manage_houses": True, "view_balances": True, "edit_invoices": False},
            is_active=True
        )
        db.session.add(caretaker)

        # ==========================================
        # 2. CREATE PROPERTIES & HOUSES
        # ==========================================
        print("🏢 Seeding Properties & Houses...")
        
        property_1 = Property(landlord_id=landlord_1.id, name="Sunrise Apartments", location="Kilimani, Nairobi")
        property_2 = Property(landlord_id=landlord_2.id, name="Sunset Villas", location="Syokimau, Machakos")
        db.session.add_all([property_1, property_2])
        db.session.flush()

        # Houses for Joseph (Sunrise Apartments)
        h1 = House(property_id=property_1.id, house_number="JK-001", base_rent=20000.00, status=HouseStatus.OCCUPIED)
        h2 = House(property_id=property_1.id, house_number="JK-002", base_rent=20000.00, status=HouseStatus.OCCUPIED)
        h3 = House(property_id=property_1.id, house_number="JK-003", base_rent=25000.00, status=HouseStatus.OCCUPIED)
        h4 = House(property_id=property_1.id, house_number="JK-004", base_rent=25000.00, status=HouseStatus.VACANT) # Vacant House
        db.session.add_all([h1, h2, h3, h4])
        db.session.flush()

        # ==========================================
        # 3. CREATE CHARGE TYPES
        # ==========================================
        water_charge = ChargeType(landlord_id=landlord_1.id, name="Water Bill")
        garbage_charge = ChargeType(landlord_id=landlord_1.id, name="Garbage Collection")
        db.session.add_all([water_charge, garbage_charge])
        db.session.flush()

        # ==========================================
        # 4. CREATE TENANTS (Edge Cases for Dashboards)
        # ==========================================
        print("👨‍👩‍👦 Seeding Tenants & Financial Edge Cases...")
        
        # Tenant 1: The "Perfect" Tenant (Zero Balance)
        tenant_1 = Tenant(
            first_name="Alice", last_name="Perfect", email="alice@sahil.com", phone_number="+254744444444",
            password_hash=generate_password_hash("password123"), id_number="11111111", 
            move_in_date=date(2025, 1, 1), house_id=h1.id, is_active=True
        )
        
        # Tenant 2: The "Defaulter" (In Arrears - Owes Money)
        tenant_2 = Tenant(
            first_name="Bob", last_name="Defaulter", email="bob@sahil.com", phone_number="+254755555555",
            password_hash=generate_password_hash("password123"), id_number="22222222", 
            move_in_date=date(2025, 5, 1), house_id=h2.id, is_active=True
        )

        # Tenant 3: The "Overpayer" (Has Advance Wallet Balance)
        tenant_3 = Tenant(
            first_name="Charlie", last_name="Advance", email="charlie@sahil.com", phone_number="+254766666666",
            password_hash=generate_password_hash("password123"), id_number="33333333", 
            move_in_date=date(2026, 1, 1), house_id=h3.id, is_active=True
        )

        # Tenant 4: Dormant/Unactivated Tenant (To test Activation Route)
        tenant_4 = Tenant(
            first_name="David", last_name="Dormant", email="david@sahil.com", phone_number="+254777777777",
            password_hash=generate_password_hash(str(uuid.uuid4())), # Unknown password
            id_number="44444444", move_in_date=date.today(), house_id=None, is_active=False,
            activation_token="test-token-12345", activation_token_expiry=datetime.utcnow() + timedelta(days=7)
        )

        db.session.add_all([tenant_1, tenant_2, tenant_3, tenant_4])
        db.session.flush()

        # ==========================================
        # 5. INVOICES, LEDGERS, & PAYMENTS
        # ==========================================
        
        current_month = date.today().replace(day=1)

        # --- TENANT 1 (Perfect Balance: Ledger = 0) ---
        inv1 = Invoice(tenant_id=tenant_1.id, billing_month=current_month, total_amount=20000, status=InvoiceStatus.PAID)
        db.session.add(inv1)
        db.session.flush()
        db.session.add(InvoiceLineItem(invoice_id=inv1.id, category="Base Rent", amount=20000))
        
        # Charge (-20,000) and Payment (+20,000)
        db.session.add(LedgerEntry(user_id=tenant_1.id, amount=-20000, transaction_type='Invoice', invoice_id=inv1.id, description="Rent Charge"))
        db.session.add(LedgerEntry(user_id=tenant_1.id, amount=20000, transaction_type='M-Pesa Payment', description="Rent Paid in Full"))


        # --- TENANT 2 (Defaulter: Owes 25,000 Total. Partial payment made) ---
        inv2 = Invoice(tenant_id=tenant_2.id, billing_month=current_month, total_amount=25000, status=InvoiceStatus.PARTIAL)
        db.session.add(inv2)
        db.session.flush()
        db.session.add(InvoiceLineItem(invoice_id=inv2.id, category="Base Rent", amount=20000))
        db.session.add(InvoiceLineItem(invoice_id=inv2.id, category="Fine", amount=5000))
        
        # Charge (-25,000) and Partial Payment (+10,000). Total Ledger = -15,000 (Arrears)
        db.session.add(LedgerEntry(user_id=tenant_2.id, amount=-25000, transaction_type='Invoice', invoice_id=inv2.id, description="Rent + Fine Charge"))
        db.session.add(LedgerEntry(user_id=tenant_2.id, amount=10000, transaction_type='M-Pesa Payment', description="Partial Payment"))


        # --- TENANT 3 (Overpayer: Billed 25,000 but paid 30,000. Wallet = +5,000) ---
        inv3 = Invoice(tenant_id=tenant_3.id, billing_month=current_month, total_amount=25000, status=InvoiceStatus.PAID)
        db.session.add(inv3)
        db.session.flush()
        db.session.add(InvoiceLineItem(invoice_id=inv3.id, category="Base Rent", amount=25000))
        
        # Charge (-25,000) and Overpayment (+30,000). Total Ledger = +5,000 (Advance)
        db.session.add(LedgerEntry(user_id=tenant_3.id, amount=-25000, transaction_type='Invoice', invoice_id=inv3.id, description="Rent Charge"))
        db.session.add(LedgerEntry(user_id=tenant_3.id, amount=30000, transaction_type='M-Pesa Payment', description="Advance Rent Payment"))


        # ==========================================
        # 6. PENDING CHARGES (For Caretaker to view)
        # ==========================================
        # Pending water bill for Alice waiting for the next 1st-of-month billing sweep
        pending = PendingCharge(
            tenant_id=tenant_1.id, charge_type_id=water_charge.id, 
            amount=1500, created_by_id=caretaker.id, notes="May Water Reading"
        )
        db.session.add(pending)

        # ==========================================
        # 7. M-PESA TRANSACTIONS (To test Webhook Claims)
        # ==========================================
        unclaimed_mpesa = MpesaTransaction(
            receipt_number="SGH1234567",
            bill_ref_number="JK-002", # Bob's House
            amount=15000, # Bob's remaining balance
            phone_number="254755555555",
            transaction_date=datetime.utcnow(),
            status=MpesaStatus.PENDING,
            raw_payload={"note": "Raw Safaricom JSON payload simulation"},
            is_claimed=False
        )
        db.session.add(unclaimed_mpesa)

        # Commit everything to the database
        db.session.commit()

        print("\n✅ Database Seeding Completed Successfully!")
        print("="*50)
        print("🔐 TEST CREDENTIALS (All passwords are 'password123'):")
        print("="*50)
        print("1. System Admin : admin@sahil.com")
        print("2. Landlord     : joseph@sahil.com (Has data, houses, tenants)")
        print("3. Caretaker    : caretaker@sahil.com (Restricted view of Joseph's properties)")
        print("4. Tenant (Paid): alice@sahil.com (Ledger = 0)")
        print("5. Tenant (Debt): bob@sahil.com (Ledger = -15,000. Try claiming M-Pesa receipt 'SGH1234567')")
        print("6. Tenant (Adv) : charlie@sahil.com (Ledger = +5,000 Wallet)")
        print(f"7. Unactivated Tenant Activation Token: test-token-12345 (Use in GET /api/auth/tenant/verify-token)")
        print("="*50)

if __name__ == '__main__':
    seed_database()