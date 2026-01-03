from flask import Blueprint, jsonify, request

# Create a Blueprint for the vehicles routes
vehicles_bp = Blueprint('vehicles_bp', __name__)

# Simple in-memory data store for demonstration
vehicles = [
    {"id": 1, "make": "Toyota", "model": "Corolla"},
    {"id": 2, "make": "Ford", "model": "Mustang"}
]

# Helper function to find max ID
def get_new_id(data):
    """Generates the next sequential ID for a list of dictionaries."""
    return max([item['id'] for item in data]) + 1 if data else 1

@vehicles_bp.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    """GET: Retrieve all vehicles."""
    return jsonify(vehicles)

@vehicles_bp.route('/api/vehicles', methods=['POST'])
def create_vehicle():
    """POST: Create a new vehicle."""
    new_vehicle = request.json
    if new_vehicle:
        new_vehicle['id'] = get_new_id(vehicles)
        vehicles.append(new_vehicle)
        return jsonify(new_vehicle), 201
    return jsonify({"error": "Invalid data"}), 400

@vehicles_bp.route('/api/vehicles/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    """GET: Retrieve a specific vehicle by ID."""
    vehicle = next((v for v in vehicles if v['id'] == vehicle_id), None)
    if vehicle:
        return jsonify(vehicle)
    return jsonify({"error": "Vehicle not found"}), 404

@vehicles_bp.route('/api/vehicles/<int:vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    """PUT: Update an existing vehicle by ID."""
    data = request.json
    vehicle = next((v for v in vehicles if v['id'] == vehicle_id), None)
    
    if vehicle and data:
        # Update only specified fields
        vehicle.update(data)
        return jsonify(vehicle)
    
    return jsonify({"error": "Vehicle not found or invalid data"}), 404

@vehicles_bp.route('/api/vehicles/<int:vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    """DELETE: Remove a vehicle by ID."""
    global vehicles
    initial_length = len(vehicles)
    vehicles = [v for v in vehicles if v['id'] != vehicle_id]
    
    if len(vehicles) < initial_length:
        return '', 204 # HTTP 204 No Content for successful deletion
    return jsonify({"error": "Vehicle not found"}), 404
