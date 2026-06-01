import os
from flask import Flask, jsonify
from flask_cors import CORS
from flasgger import Swagger
from dotenv import load_dotenv
from datetime import timedelta
from celery import Celery
from celery.schedules import crontab

# Import extensions and models to ensure they register correctly
from extensions import db, migrate, jwt
import models  # Ensures models are known to SQLAlchemy/Alembic

# Load environment variables from .env file
load_dotenv()


def make_celery(app):
    """
    Factory function to initialize and configure Celery with the Flask app context.
    Ensures background workers can safely interact with database models via SQLAlchemy.
    """
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery


def create_app():
    """
    Application factory for Sahil Rent Pay Solutions.
    """
    app = Flask(__name__)

    # 1. Environment & Configuration Settings
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', os.getenv('DATABASE_URL'))
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # JWT Settings
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', os.getenv('SECRET_KEY'))
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

    # Celery Configurations (Using Redis as the message broker)
    redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    app.config['CELERY_BROKER_URL'] = redis_url
    app.config['CELERY_RESULT_BACKEND'] = redis_url
    app.config['CELERY_TIMEZONE'] = 'Africa/Nairobi'

    # Swagger Documentation Config
    app.config['SWAGGER'] = {
        'title': 'Sahil Rent Pay API',
        'uiversion': 3,
        'version': '1.0.0',
        'description': 'API documentation for Sahil Rent Pay Solutions'
    }

    # 2. Initialize Extensions with App Instance
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # 3. Enable Cross-Origin Resource Sharing (CORS) for the React frontend
    allowed_origins = os.environ.get(
        'ALLOWED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173'
    ).split(',')
    CORS(app, resources={r"/*": {"origins": allowed_origins}})
    
    Swagger(app)

    # 4. Import and Register Blueprints from the routes package
    from routes.auth_routes import auth_bp
    from routes.admin_routes import admin_bp
    from routes.property_management_routes import property_mgmt_bp
    from routes.billing_routes import billing_bp
    from routes.caretaker_routes import caretaker_bp
    from routes.tenant_portal_routes import tenant_portal_bp
    from routes.mpesa_routes import mpesa_bp
    from routes.report_routes import report_bp
    from routes.webhook_routes import webhook_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(property_mgmt_bp)
    app.register_blueprint(billing_bp)
    app.register_blueprint(caretaker_bp)
    app.register_blueprint(tenant_portal_bp)
    app.register_blueprint(mpesa_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(webhook_bp)

    # 5. Global Error Handling Customization
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found", "message": "The requested resource does not exist"}), 404

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"error": "Access forbidden", "message": "You do not have permission to access this resource"}), 403

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad request", "message": "The request was invalid or malformed"}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"error": "Unauthorized", "message": "Authentication is required to access this resource"}), 401

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error", "message": "An unexpected error occurred"}), 500

    # 6. Global JWT Error Handling Customization
    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        return jsonify({"error": "Unauthorized", "message": "Missing or invalid token"}), 401

    @jwt.invalid_token_loader
    def invalid_token_response(callback):
        return jsonify({"error": "Unauthorized", "message": "Invalid token provided"}), 401

    @jwt.expired_token_loader
    def expired_token_response(jwt_header, jwt_payload):
        return jsonify({"error": "Unauthorized", "message": "Token has expired"}), 401

    # Base Route
    @app.route('/')
    def home():
        return jsonify({"message": "Welcome to the Sahil Rent Pay Solutions API"})

    return app


# Generate App and Celery instances for production servers (Gunicorn & Celery Worker CLI)
app = create_app()
celery_app = make_celery(app)

# Celery Beat Periodic Tasks Configuration (Automation Hub)
celery_app.conf.beat_schedule = {
    # Run trial evaluations daily at midnight to update processing fees automatically
    'daily-trial-evaluation': {
        'task': 'tasks.evaluate_free_trials',
        'schedule': crontab(hour=0, minute=0),
    },
    
    # Execute master billing sweeps at 12:05 AM on the 1st day of every month
    'monthly-billing-sweep': {
        'task': 'tasks.execute_monthly_billing',
        'schedule': crontab(day_of_month='1', hour=0, minute=5),
    },
}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)