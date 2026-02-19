from flask import Blueprint, jsonify, request
from application import logger
from sqlalchemy import text
from database import db_engine
from pydantic import ValidationError

from contract.contractor_details import ContractorDetails
from contract.contractor_summary import ContractorSummary
from contract.contractor_status_update import ContractorStatusUpdate

contractors_bp = Blueprint('contractors_bp', __name__)

@contractors_bp.route('/', methods=['GET'], strict_slashes=False)
def get_contractors():
    city = request.args.get('city')
    
    query = text('''
        SELECT 
            c.customer_id AS id,
            c.name,
            c.status,
            c.tax_id_number,
            (
                SELECT json_agg(json_build_object('type', cc.type, 'details', cc.details))
                FROM customer_contact cc
                WHERE cc.customer_id = c.customer_id
            ) AS contacts
        FROM customer c
        LEFT JOIN customer_address ca ON c.customer_id = ca.customer_id
        WHERE c.is_deleted = false
            AND (:city IS NULL OR (ca.city = :city AND ca.address_type = 'CORPORATE'))
        GROUP BY c.customer_id, c.name, c.status, c.tax_id_number
        ORDER BY c.customer_id;
    ''')
    
    with db_engine.connect() as conn:
        result = conn.execute(query, {'city': city})
        raw_contractors = result.mappings().all()

    contractors = []
    for raw_contractor in raw_contractors:
        try:
            contractor_data = {
                'id': str(raw_contractor['id']),
                'name': raw_contractor['name'],
                'status': (raw_contractor['status'] or '').upper(),
                'tax_id_number': raw_contractor['tax_id_number'],
                'contacts': raw_contractor['contacts'] or []
            }
            validated_contractor = ContractorSummary.from_dict(contractor_data)
            contractors.append(validated_contractor.to_dict())
        except ValidationError as e:
            logger.error(f"Data validation error for contractor data: {raw_contractor}. Error: {e}")
            return jsonify({'error': 'Internal server error: data validation failed'}), 500
    
    logger.info(f"Contractor validation successful for {len(contractors)} contractors")
    logger.info(f"Fetched {len(contractors)} contractors")
    return jsonify(contractors)

@contractors_bp.route('/representatives', methods=['GET'])
def get_contractor_representatives():
    query = text('''
        SELECT c.name AS company, e.name AS rep_name, ce.job_title
        FROM customer c
        JOIN customer_employee ce ON c.customer_id = ce.customer_id
        JOIN employee e ON ce.employee_id = e.employee_id
        WHERE ce.employee_type = 'representative';
    ''')
    with db_engine.connect() as conn:
        result = conn.execute(query)
        representatives = [dict(row) for row in result.mappings()]
    logger.info(f"Fetched {len(representatives)} contractor representatives")
    return jsonify(representatives)

@contractors_bp.route('/<int:id>', methods=['GET'])
def get_contractor_details(id):
    query = text('''
    WITH contractor_base AS (
        SELECT
            c.customer_id,
            c.name AS contractor_name,
            c.status,
            c.tax_id_number,
            c.created_at,
            c.updated_at
        FROM customer c
        WHERE c.customer_id = :id AND c.is_deleted = false
    ),
    contractor_contacts AS (
        SELECT
            customer_id,
            json_agg(json_build_object('type', type, 'details', details)) AS contacts
        FROM customer_contact
        WHERE customer_id = :id
        GROUP BY customer_id
    ),
    contractor_addresses AS (
        SELECT
            customer_id,
            json_agg(json_build_object(
                'address_id', address_id,
                'street_address', street_address,
                'city', city,
                'country', country,
                'postal_code', postal_code,
                'address_type', address_type
            )) AS addresses
        FROM customer_address
        WHERE customer_id = :id
        GROUP BY customer_id
    ),
    employee_contacts AS (
        SELECT
            e.employee_id,
            json_agg(json_build_object('type', 'email', 'details', e.email) 
                     ORDER BY 'email') AS contacts
        FROM employee e
        WHERE e.employee_id IN (
            SELECT employee_id FROM customer_employee WHERE customer_id = :id
        )
        GROUP BY e.employee_id
    ),
    customer_employees AS (
        SELECT
            ce.customer_id,
            e.employee_id,
            e.name AS employee_name,
            ce.employee_type,
            ce.job_title,
            ec.contacts
        FROM customer_employee ce
        JOIN employee e ON ce.employee_id = e.employee_id
        LEFT JOIN employee_contacts ec ON e.employee_id = ec.employee_id
        WHERE ce.customer_id = :id AND e.is_deleted = false
    ),
    aggregated_employees AS (
        SELECT
            customer_id,
            json_agg(json_build_object(
                'employee_id', employee_id,
                'employee_name', employee_name,
                'employee_data', json_build_object(
                    'type', employee_type,
                    'job_title', job_title
                ),
                'contacts', contacts
            )) AS employees
        FROM customer_employees
        GROUP BY customer_id
    )
    SELECT
        cb.customer_id as id,
        cb.contractor_name as name,
        cb.status,
        cb.tax_id_number,
        cb.created_at,
        cb.updated_at,
        cc.contacts,
        ca.addresses,
        ae.employees
    FROM contractor_base cb
    LEFT JOIN contractor_contacts cc ON cb.customer_id = cc.customer_id
    LEFT JOIN contractor_addresses ca ON cb.customer_id = ca.customer_id
    LEFT JOIN aggregated_employees ae ON cb.customer_id = ae.customer_id;
    ''')
    with db_engine.connect() as conn:
        result = conn.execute(query, {'id': id})
        raw_contractor = result.mappings().first()
        if not raw_contractor:
            return jsonify({'error': f'Contractor id {id} not found'}), 404

    try:
        response = dict(raw_contractor)
        response['id'] = str(response['id'])
        response['status'] = (response.get('status') or '').upper()
        response['contacts'] = response.get('contacts') or []
        response['employees'] = response.get('employees') or []
        response['addresses'] = response.get('addresses') or []

        for employee in response.get('employees', []):
            if 'employee_id' in employee:
                employee['employee_id'] = str(employee['employee_id'])

        for address in response.get('addresses', []):
            if 'address_id' in address and address['address_id'] is not None:
                address['address_id'] = str(address['address_id'])

        contractor_details = ContractorDetails.from_dict(response).to_dict()
        logger.info(f"Contractor validation successful for {id}")
    except ValidationError as e:
        logger.error(f"Data validation error for contractor {id}: {e}, {response}")
        return jsonify({'error': 'Internal server error: data validation failed'}), 500

    logger.info(f"Fetched contractor details for {id}")
    return jsonify(contractor_details)

@contractors_bp.route('/<int:id>/contacts', methods=['GET'])
def get_contractor_contacts(id):
    contact_type = request.args.get('type')
    if not contact_type:
        query = text('''
            SELECT contact_id, customer_id, type, details
            FROM customer_contact
            WHERE customer_id = :id;
        ''')
        params = {'id': id}
    else:
        query = text('''
            SELECT contact_id, customer_id, type, details
            FROM customer_contact
            WHERE customer_id = :id AND type = :type;
        ''')
        params = {'id': id, 'type': contact_type}
    with db_engine.connect() as conn:
        result = conn.execute(query, params)
        contacts = [dict(row) for row in result.mappings()]
    logger.info(f"Fetched {len(contacts)} contacts for contractor {id}" + (f" (type={contact_type})" if contact_type else ""))
    return jsonify(contacts)

@contractors_bp.route('/<int:id>', methods=['PATCH'])
def update_contractor_status(id):
    data = request.get_json()
    try:
        status_update = ContractorStatusUpdate.from_dict(data or {})
        new_status = status_update.status.value
    except ValidationError as e:
        return jsonify({'error': f"Invalid request body: {e}"}), 400

    # Database expects lowercase status values ('active', 'inactive')
    db_status = new_status.lower()

    query = text("""
        UPDATE customer
        SET status = :new_status, updated_at = CURRENT_TIMESTAMP
        WHERE customer_id = :id AND is_deleted = false
        RETURNING customer_id;
    """)

    with db_engine.connect() as conn:
        with conn.begin():
            result = conn.execute(query, {'id': id, 'new_status': db_status})
            updated_row = result.fetchone()

    if not updated_row:
        return jsonify({'error': f'Contractor with id {id} not found'}), 404

    logger.info(f"Updated status for contractor {id} to {new_status}")
    return jsonify({'message': f'Contractor {id} status updated successfully to {new_status}'}), 200
