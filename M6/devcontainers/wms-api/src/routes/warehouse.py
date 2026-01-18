from flask import Blueprint, jsonify, request
from application import logger
from sqlalchemy import text
from database import db_engine

warehouse_bp = Blueprint('warehouse_bp', __name__)

@warehouse_bp.route('/<int:warehouse_id>', methods=['GET'])
def get_warehouse_employees(warehouse_id):
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
            employee_warehouse ew ON p.party_id = ew.party_id
        JOIN
            party_role pr ON p.party_id = pr.party_id
        JOIN
            role r ON pr.role_id = r.role_id
        WHERE
            ew.warehouse_id = :warehouse_id
            AND p.data->>'type' = 'employee'
        GROUP BY
            p.party_id, p.name, p.contact_email, p.contact_phone, p.created_at
        ORDER BY
            p.name;
    ''')
    with db_engine.connect() as conn:
        result = conn.execute(query, {'warehouse_id': warehouse_id})
        employees = [dict(row) for row in result.mappings()]
    logger.info(f"Fetched {len(employees)} employees for warehouse {warehouse_id}")
    return jsonify(employees)