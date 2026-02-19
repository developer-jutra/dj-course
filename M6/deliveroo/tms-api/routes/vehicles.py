from flask import Blueprint, jsonify, request
from copy import deepcopy

from seed_data import VEHICLES

vehicles_bp = Blueprint('vehicles_bp', __name__)

# Mutable copy for in-memory updates
vehicles = deepcopy(VEHICLES)


def _find_vehicle(vehicle_id):
    """Find vehicle by id (supports both string and int)."""
    for v in vehicles:
        if str(v['id']) == str(vehicle_id):
            return v
    return None


@vehicles_bp.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    """GET: Retrieve all vehicles with optional filtering."""
    result = list(vehicles)
    status = request.args.get('status')
    type_filter = request.args.get('type')
    search = request.args.get('search', '').lower()

    if status:
        result = [v for v in result if v.get('status') == status]
    if type_filter:
        result = [v for v in result if v.get('type') == type_filter]
    if search:
        result = [
            v for v in result
            if search in v.get('plateNumber', '').lower()
            or search in v.get('make', '').lower()
            or search in v.get('model', '').lower()
            or search in (v.get('currentDriver') or '').lower()
        ]
    return jsonify(result)


@vehicles_bp.route('/api/vehicles', methods=['POST'])
def create_vehicle():
    """POST: Create a new vehicle."""
    new_vehicle = request.json
    if new_vehicle:
        new_id = f"vehicle-{len(vehicles) + 1:03d}"
        new_vehicle['id'] = new_id
        vehicles.append(new_vehicle)
        return jsonify(new_vehicle), 201
    return jsonify({"error": "Invalid data"}), 400


@vehicles_bp.route('/api/vehicles/<vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    """GET: Retrieve a specific vehicle by ID."""
    vehicle = _find_vehicle(vehicle_id)
    if vehicle:
        return jsonify(vehicle)
    return jsonify({"error": "Vehicle not found"}), 404


@vehicles_bp.route('/api/vehicles/<vehicle_id>/maintenance', methods=['GET'])
def get_vehicle_maintenance(vehicle_id):
    """GET: Retrieve maintenance data for a vehicle."""
    vehicle = _find_vehicle(vehicle_id)
    if not vehicle:
        return jsonify({"error": "Vehicle not found"}), 404
    return jsonify({
        "history": vehicle.get('maintenanceHistory', []),
        "tasks": vehicle.get('maintenanceTasks', []),
    })


@vehicles_bp.route('/api/vehicles/<vehicle_id>/routes', methods=['GET'])
def get_vehicle_routes(vehicle_id):
    """GET: Retrieve route history for a vehicle."""
    vehicle = _find_vehicle(vehicle_id)
    if not vehicle:
        return jsonify({"error": "Vehicle not found"}), 404
    # Generate mock route history (API doesn't store routes yet)
    routes = []
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    for i in range(5):
        start = now - timedelta(days=i * 5)
        end = start + timedelta(days=1)
        routes.append({
            "id": f"route-{vehicle_id}-{i}",
            "name": f"Route {i + 1}",
            "startDate": start.isoformat() + "Z",
            "endDate": end.isoformat() + "Z",
            "distance": 200 + i * 100,
            "status": "active" if i == 0 else "completed",
        })
    return jsonify(routes)


@vehicles_bp.route('/api/vehicles/<vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    """PUT: Update an existing vehicle by ID."""
    data = request.json
    vehicle = _find_vehicle(vehicle_id)
    if vehicle and data:
        for k, v in data.items():
            if k != 'id':
                vehicle[k] = v
        return jsonify(vehicle)
    return jsonify({"error": "Vehicle not found or invalid data"}), 404


@vehicles_bp.route('/api/vehicles/<vehicle_id>/status', methods=['PUT'])
def update_vehicle_status(vehicle_id):
    """PUT: Update vehicle status."""
    data = request.json
    vehicle = _find_vehicle(vehicle_id)
    if not vehicle:
        return jsonify({"error": "Vehicle not found"}), 404
    if data and 'status' in data:
        vehicle['status'] = data['status']
        return jsonify(vehicle)
    return jsonify({"error": "Invalid data"}), 400


@vehicles_bp.route('/api/vehicles/<vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    """DELETE: Remove a vehicle by ID."""
    global vehicles
    initial = len(vehicles)
    vehicles = [v for v in vehicles if str(v['id']) != str(vehicle_id)]
    if len(vehicles) < initial:
        return '', 204
    return jsonify({"error": "Vehicle not found"}), 404
