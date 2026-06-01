from flask import Blueprint, request, jsonify
from extensions import db
from models import NotificationLog, NotificationStatus

webhook_bp = Blueprint('webhooks', __name__, url_prefix='/api/webhooks')

# POST /api/webhooks/sms-delivery
@webhook_bp.route('/sms-delivery', methods=['POST'])
def africas_talking_delivery_report():
    """
    Africa's Talking Delivery Report Webhook.
    NOTE: No JWT required. This is a public endpoint for AT servers.
    ---
    tags:
      - Webhooks
    responses:
      200:
        description: Acknowledges receipt of the delivery report.
    """
    # Africa's Talking typically sends data as form-urlencoded
    data = request.form if request.form else request.get_json()
    
    if not data:
        return jsonify({"status": "ignored", "message": "No data received"}), 400

    # Extract Africa's Talking parameters
    message_id = data.get('id')
    status = data.get('status') # e.g., 'Success', 'Failed', 'Rejected'
    
    if not message_id:
        return jsonify({"status": "ignored", "message": "Missing message ID"}), 400

    # Find the log in our database
    log_entry = NotificationLog.query.filter_by(provider_message_id=message_id).first()
    
    if log_entry:
        if status == 'Success':
            log_entry.status = NotificationStatus.DELIVERED
            log_entry.delivered_at = db.func.now()
        else:
            log_entry.status = NotificationStatus.FAILED
            
        db.session.commit()

    # Always return 200 OK so Africa's Talking knows we received it
    return jsonify({"status": "received"}), 200