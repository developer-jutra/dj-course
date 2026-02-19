from flask import Blueprint, jsonify, request
from copy import deepcopy

from seed_data import DRIVERS

drivers_bp = Blueprint('drivers_bp', __name__)

drivers = deepcopy(DRIVERS)


def _find_driver(driver_id):
    """Find driver by id (supports both string and int)."""
    for d in drivers:
        if str(d['id']) == str(driver_id):
            return d
    return None


@drivers_bp.route('/api/drivers', methods=['GET'])
def get_drivers():
    """GET: Retrieve all drivers with optional filtering."""
    result = list(drivers)
    status = request.args.get('status')
    contract_type = request.args.get('contractType')
    search = request.args.get('search', '').lower()

    if status:
        result = [d for d in result if d.get('status') == status]
    if contract_type:
        result = [d for d in result if d.get('contractType') == contract_type]
    if search:
        result = [
            d for d in result
            if search in (d.get('name') or '').lower()
            or search in (d.get('email') or '').lower()
        ]
    return jsonify(result)


@drivers_bp.route('/api/drivers', methods=['POST'])
def create_driver():
    """POST: Create a new driver."""
    new_driver = request.json
    if new_driver:
        new_id = f"driver-{len(drivers) + 1:03d}"
        new_driver['id'] = new_id
        drivers.append(new_driver)
        return jsonify(new_driver), 201
    return jsonify({"error": "Invalid data"}), 400


@drivers_bp.route('/api/drivers/<driver_id>', methods=['GET'])
def get_driver(driver_id):
    """GET: Retrieve a specific driver by ID."""
    driver = _find_driver(driver_id)
    if driver:
        return jsonify(driver)
    return jsonify({"error": "Driver not found"}), 404


@drivers_bp.route('/api/drivers/<driver_id>/shipments', methods=['GET'])
def get_driver_shipments(driver_id):
    """GET: Retrieve shipments assigned to a driver."""
    driver = _find_driver(driver_id)
    if not driver:
        return jsonify({"error": "Driver not found"}), 404
    # Empty list - API doesn't store shipments yet
    return jsonify([])


@drivers_bp.route('/api/drivers/<driver_id>/routes', methods=['GET'])
def get_driver_routes(driver_id):
    """GET: Retrieve routes for a driver."""
    driver = _find_driver(driver_id)
    if not driver:
        return jsonify({"error": "Driver not found"}), 404
    return jsonify(driver.get('routes', []))


@drivers_bp.route('/api/drivers/<driver_id>/calendar', methods=['GET'])
def get_driver_calendar(driver_id):
    """GET: Retrieve calendar events for a driver."""
    driver = _find_driver(driver_id)
    if not driver:
        return jsonify({"error": "Driver not found"}), 404
    return jsonify(driver.get('calendarEvents', []))


@drivers_bp.route('/api/drivers/<driver_id>', methods=['PUT'])
def update_driver(driver_id):
    """PUT: Update an existing driver by ID."""
    data = request.json
    driver = _find_driver(driver_id)
    if driver and data:
        for k, v in data.items():
            if k != 'id':
                driver[k] = v
        return jsonify(driver)
    return jsonify({"error": "Driver not found or invalid data"}), 404


@drivers_bp.route('/api/drivers/<driver_id>/status', methods=['PUT'])
def update_driver_status(driver_id):
    """PUT: Update driver status."""
    data = request.json
    driver = _find_driver(driver_id)
    if not driver:
        return jsonify({"error": "Driver not found"}), 404
    if data and 'status' in data:
        driver['status'] = data['status']
        return jsonify(driver)
    return jsonify({"error": "Invalid data"}), 400
