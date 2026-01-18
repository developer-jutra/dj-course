from flask import Blueprint, jsonify, request

# Create a Blueprint for the drivers routes
drivers_bp = Blueprint('drivers_bp', __name__)

# Simple in-memory data store for demonstration
drivers = [
    {"id": 101, "name": "Alice", "license_id": "A123"},
    {"id": 102, "name": "Bob", "license_id": "B456"}
]

# Helper function to find max ID
def get_new_id(data):
    """Generates the next sequential ID for a list of dictionaries."""
    return max([item['id'] for item in data]) + 1 if data else 1

@drivers_bp.route('/api/drivers', methods=['GET'])
def get_drivers():
    """GET: Retrieve all drivers."""
    return jsonify(drivers)

@drivers_bp.route('/api/drivers', methods=['POST'])
def create_driver():
    """POST: Create a new driver."""
    new_driver = request.json
    if new_driver:
        new_driver['id'] = get_new_id(drivers)
        drivers.append(new_driver)
        return jsonify(new_driver), 201
    return jsonify({"error": "Invalid data"}), 400

@drivers_bp.route('/api/drivers/<int:driver_id>', methods=['GET'])
def get_driver(driver_id):
    """GET: Retrieve a specific driver by ID."""
    driver = next((d for d in drivers if d['id'] == driver_id), None)
    if driver:
        return jsonify(driver)
    return jsonify({"error": "Driver not found"}), 404
