import os
from flask import Flask
from flask_cors import CORS
from routes.index import index_bp
from routes.vehicles import vehicles_bp
from routes.drivers import drivers_bp
from routes.notifications import notifications_bp

# Create a Flask application instance
app = Flask(__name__)
CORS(app, origins=os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(','))

# Register Blueprints
app.register_blueprint(index_bp)
app.register_blueprint(vehicles_bp)
app.register_blueprint(drivers_bp)
app.register_blueprint(notifications_bp)

# Endpoint for Gunicorn to find the application object
# This is mainly for local testing with 'flask run' but kept for clarity
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3030))
    app.run(host='0.0.0.0', port=port, debug=True)

