from extensions import db, celery
from models import (
    Tenant, House, Property, Landlord, Invoice, InvoiceLineItem, 
    PendingCharge, LedgerEntry, PlatformSettings, InvoiceStatus, NotificationLog, NotificationChannel
)
from datetime import datetime, date
from sqlalchemy.orm import joinedload

@celery.task(name="tasks.execute_monthly_billing")
def execute_monthly_billing():
    """
    Runs at midnight on the 1st of the month.
    Generates invoices, applies pending charges, and deducts from advance wallets.
    """
    print(f"[{datetime.utcnow()}] Starting automated monthly billing sweep...")
    current_month_start = date.today().replace(day=1)
    
    # 1. Fetch all active tenants and their houses
    active_tenants = Tenant.query.options(joinedload(Tenant.house)).filter_by(is_archived=False).all()
    
    invoices_generated = 0
    
    for tenant in active_tenants:
        if not tenant.house:
            continue
            
        base_rent = float(tenant.house.base_rent)
        
        # Create Master Invoice
        invoice = Invoice(
            tenant_id=tenant.id,
            billing_month=current_month_start,
            total_amount=0, # Will calculate below
            status=InvoiceStatus.UNPAID
        )
        db.session.add(invoice)
        db.session.flush() # Flush to get invoice ID
        
        total_invoice_amount = base_rent
        
        # Add Base Rent Line Item
        db.session.add(InvoiceLineItem(
            invoice_id=invoice.id,
            category='Base Rent',
            amount=base_rent
        ))
        
        # 2. Fetch and apply Pending Charges (Water, Garbage, etc.)
        pending_charges = PendingCharge.query.filter_by(tenant_id=tenant.id, is_invoiced=False).all()
        for charge in pending_charges:
            total_invoice_amount += float(charge.amount)
            
            db.session.add(InvoiceLineItem(
                invoice_id=invoice.id,
                category=charge.charge_type.name if charge.charge_type else 'Utility',
                amount=float(charge.amount)
            ))
            charge.is_invoiced = True # Mark as processed
            
        # Update invoice total
        invoice.total_amount = total_invoice_amount
        
        # 3. Update Master Ledger (Negative amount for a bill)
        db.session.add(LedgerEntry(
            user_id=tenant.id,
            amount=-abs(total_invoice_amount),
            transaction_type='Monthly Invoice',
            invoice_id=invoice.id,
            description=f"Automated Billing for {current_month_start.strftime('%B %Y')}"
        ))
        
        # 4. Queue the SMS Notification
        db.session.add(NotificationLog(
            recipient_id=tenant.id,
            channel=NotificationChannel.SMS,
            template_type='monthly_invoice',
            status='SENT' # Assume sent to queue
        ))
        
        invoices_generated += 1

    db.session.commit()
    return f"Billing Sweep Complete: Generated {invoices_generated} invoices."


@celery.task(name="tasks.evaluate_free_trials")
def evaluate_free_trials():
    """
    Runs daily at midnight.
    Checks trial_end_date and reverts processing_fee to default if expired.
    """
    print(f"[{datetime.utcnow()}] Evaluating Free Trials...")
    
    settings = PlatformSettings.query.first()
    default_fee = settings.default_processing_fee if settings else 4.00
    
    # Find landlords whose trial has expired but fee is still 0
    expired_landlords = Landlord.query.filter(
        Landlord.trial_end_date < datetime.utcnow(),
        Landlord.processing_fee == 0.00
    ).all()

    for landlord in expired_landlords:
        landlord.processing_fee = default_fee
        
    db.session.commit()
    return f"Trial Evaluation Complete: Reverted fees for {len(expired_landlords)} landlords."