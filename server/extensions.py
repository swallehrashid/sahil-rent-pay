from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

# Initialize the extensions (they will be linked to the app in app.py)
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
