from flask import Blueprint, jsonify, request
from application import logger
from sqlalchemy import text
from database import db_engine

employees_bp = Blueprint('employees_bp', __name__)

@employees_bp.route('/', methods=['GET'])
def get_employees():
    query = text('''
        SELECT
            p.party_id AS employee_id,
            p.name AS employee_name,
            p.contact_email AS email,
            p.contact_phone AS phone,
            p.created_at AS hire_date,
            STRING_AGG(r.name, ', ') AS roles
        FROM
            party p
        JOIN
            party_role pr ON p.party_id = pr.party_id
        JOIN
            role r ON pr.role_id = r.role_id
        WHERE
            p.data->>'type' = 'employee'
        GROUP BY
            p.party_id, p.name, p.contact_email, p.contact_phone, p.created_at
        ORDER BY
            p.name;
    ''')
    with db_engine.connect() as conn:
        result = conn.execute(query)
        employees = [dict(row) for row in result.mappings()]
    logger.info(f"Fetched {len(employees)} employees")
    return jsonify(employees)

@employees_bp.route('/<int:employee_id>', methods=['GET'])
def get_employee(employee_id):
    query = text('''
        SELECT
            p.party_id AS employee_id,
            p.name AS employee_name,
            p.contact_email AS email,
            p.contact_phone AS phone,
            p.created_at AS hire_date,
            STRING_AGG(r.name, ', ') AS roles
        FROM
            party p
        JOIN
            party_role pr ON p.party_id = pr.party_id
        JOIN
            role r ON pr.role_id = r.role_id
        WHERE
            p.data->>'type' = 'employee'
            AND p.party_id = :employee_id
        GROUP BY
            p.party_id, p.name, p.contact_email, p.contact_phone, p.created_at
        ORDER BY
            p.name;
    ''')
    with db_engine.connect() as conn:
        result = conn.execute(query, {'employee_id': employee_id})
        employees = [dict(row) for row in result.mappings()]
        if len(employees) == 0:
            return jsonify({'error': f'Employee id {employee_id} not found'}), 404
        employee = employees[0]
    logger.info(f"Fetched employee {employee_id}")
    return jsonify(employee)
