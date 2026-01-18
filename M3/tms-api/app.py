from flask import Flask
from routes.index import index_bp
from routes.vehicles import vehicles_bp
from routes.drivers import drivers_bp
from routes.notifications import notifications_bp

# Create a Flask application instance
app = Flask(__name__)

# Register Blueprints
app.register_blueprint(index_bp)
app.register_blueprint(vehicles_bp)
app.register_blueprint(drivers_bp)
app.register_blueprint(notifications_bp)

# Endpoint for Gunicorn to find the application object
# This is mainly for local testing with 'flask run' but kept for clarity
if __name__ == '__main__':
    # Typically, Gunicorn handles serving, but this allows for local debug run
    app.run(host='0.0.0.0', port=3030, debug=True)

