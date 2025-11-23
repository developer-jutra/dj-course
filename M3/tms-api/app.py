from flask import Flask, jsonify, request

# Create a Flask application instance
app = Flask(__name__)

# Simple in-memory data store for demonstration
vehicles = [
    {"id": 1, "make": "Toyota", "model": "Corolla"},
    {"id": 2, "make": "Ford", "model": "Mustang"}
]
drivers = [
    {"id": 101, "name": "Alice", "license_id": "A123"},
    {"id": 102, "name": "Bob", "license_id": "B456"}
]

# Helper function to find max ID
def get_new_id(data):
    """Generates the next sequential ID for a list of dictionaries."""
    return max([item['id'] for item in data]) + 1 if data else 1

### VEHICLES ENDPOINTS ###

@app.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    """GET: Retrieve all vehicles."""
    return jsonify(vehicles)

@app.route('/api/vehicles', methods=['POST'])
def create_vehicle():
    """POST: Create a new vehicle."""
    new_vehicle = request.json
    if new_vehicle:
        new_vehicle['id'] = get_new_id(vehicles)
        vehicles.append(new_vehicle)
        return jsonify(new_vehicle), 201
    return jsonify({"error": "Invalid data"}), 400

@app.route('/api/vehicles/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    """GET: Retrieve a specific vehicle by ID."""
    vehicle = next((v for v in vehicles if v['id'] == vehicle_id), None)
    if vehicle:
        return jsonify(vehicle)
    return jsonify({"error": "Vehicle not found"}), 404

@app.route('/api/vehicles/<int:vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    """PUT: Update an existing vehicle by ID."""
    data = request.json
    vehicle = next((v for v in vehicles if v['id'] == vehicle_id), None)
    
    if vehicle and data:
        # Update only specified fields
        vehicle.update(data)
        return jsonify(vehicle)
    
    return jsonify({"error": "Vehicle not found or invalid data"}), 404

@app.route('/api/vehicles/<int:vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    """DELETE: Remove a vehicle by ID."""
    global vehicles
    initial_length = len(vehicles)
    vehicles = [v for v in vehicles if v['id'] != vehicle_id]
    
    if len(vehicles) < initial_length:
        return '', 204 # HTTP 204 No Content for successful deletion
    return jsonify({"error": "Vehicle not found"}), 404

### DRIVERS ENDPOINTS (GET/POST Example) ###

@app.route('/api/drivers', methods=['GET'])
def get_drivers():
    """GET: Retrieve all drivers."""
    return jsonify(drivers)

@app.route('/api/drivers', methods=['POST'])
def create_driver():
    """POST: Create a new driver."""
    new_driver = request.json
    if new_driver:
        new_driver['id'] = get_new_id(drivers)
        drivers.append(new_driver)
        return jsonify(new_driver), 201
    return jsonify({"error": "Invalid data"}), 400

@app.route('/api/drivers/<int:driver_id>', methods=['GET'])
def get_driver(driver_id):
    """GET: Retrieve a specific driver by ID."""
    driver = next((d for d in drivers if d['id'] == driver_id), None)
    if driver:
        return jsonify(driver)
    return jsonify({"error": "Driver not found"}), 404

# Endpoint for Gunicorn to find the application object
# This is mainly for local testing with 'flask run' but kept for clarity
if __name__ == '__main__':
    # Typically, Gunicorn handles serving, but this allows for local debug run
    app.run(debug=True)

