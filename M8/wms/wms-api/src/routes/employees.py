from flask import Blueprint, jsonify, request
from application import logger
from sqlalchemy import text
from database import db_engine

employees_bp = Blueprint('employees_bp', __name__)

@employees_bp.route('/', methods=['GET'])
def get_employees():
    query = text('''
        SELECT
            e.employee_id,
            e.name AS employee_name,
            e.email,
            e.phone,
            e.hire_date,
            STRING_AGG(r.name, ', ') AS roles
        FROM
            employee e
        JOIN
            employee_role er ON e.employee_id = er.employee_id
        JOIN
            role r ON er.role_id = r.role_id
        WHERE
            e.is_deleted = false
        GROUP BY
            e.employee_id, e.name, e.email, e.phone, e.hire_date
        ORDER BY
            e.name;
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
            e.employee_id,
            e.name AS employee_name,
            e.email,
            e.phone,
            e.hire_date,
            STRING_AGG(r.name, ', ') AS roles
        FROM
            employee e
        JOIN
            employee_role er ON e.employee_id = er.employee_id
        JOIN
            role r ON er.role_id = r.role_id
        WHERE
            e.is_deleted = false
            AND e.employee_id = :employee_id
        GROUP BY
            e.employee_id, e.name, e.email, e.phone, e.hire_date
        ORDER BY
            e.name;
    ''')
    with db_engine.connect() as conn:
        result = conn.execute(query, {'employee_id': employee_id})
        employees = [dict(row) for row in result.mappings()]
        if len(employees) == 0:
            return jsonify({'error': f'Employee id {employee_id} not found'}), 404
        employee = employees[0]
    logger.info(f"Fetched employee {employee_id}")
    return jsonify(employee)

@employees_bp.route('/<int:employee_id>/warehouses', methods=['GET'])
def get_employee_warehouses(employee_id):
    query = text('''
        SELECT w.name, ew.assigned_from
        FROM warehouse w
        JOIN employee_warehouse ew ON w.warehouse_id = ew.warehouse_id
        WHERE ew.employee_id = :employee_id;
    ''')
    with db_engine.connect() as conn:
        result = conn.execute(query, {'employee_id': employee_id})
        warehouses = [dict(row) for row in result.mappings()]
    logger.info(f"Fetched {len(warehouses)} warehouses for employee {employee_id}")
    return jsonify(warehouses)
