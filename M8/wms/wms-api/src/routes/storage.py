from flask import Blueprint, jsonify, request
from application import logger
from sqlalchemy import text
from database import db_engine

storage_bp = Blueprint('storage_bp', __name__)

@storage_bp.route('/reservations/active', methods=['GET'])
def get_active_reservations():
    query = text('''
        SELECT *
        FROM storage_reservation
        WHERE status = 'active'
        ORDER BY reserved_from ASC
        LIMIT 50;
    ''')
    with db_engine.connect() as conn:
        result = conn.execute(query)
        reservations = [dict(row) for row in result.mappings()]
    logger.info(f"Fetched {len(reservations)} active reservations")
    return jsonify(reservations)

@storage_bp.route('/cargo', methods=['GET'])
def get_cargo_by_description():
    description = request.args.get('description')
    if not description:
        return jsonify([])
    query = text('''
        SELECT *
        FROM storage_record
        WHERE cargo_description ILIKE :pattern;
    ''')
    pattern = f'%{description}%'
    with db_engine.connect() as conn:
        result = conn.execute(query, {'pattern': pattern})
        rows = [dict(row) for row in result.mappings()]
    logger.info(f"Fetched {len(rows)} storage records for description '{description}'")
    return jsonify(rows)

@storage_bp.route('/<int:record_id>/events', methods=['GET'])
def get_storage_event_history(record_id):
    severity = request.args.get('severity')
    if severity:
        query = text('''
            SELECT event_time, details
            FROM storage_event_history
            WHERE storage_record_id = :record_id
              AND details->>'severity' = :severity
            ORDER BY event_time;
        ''')
        params = {'record_id': record_id, 'severity': severity}
    else:
        query = text('''
            SELECT
                event_id,
                storage_record_id,
                event_type_id,
                event_time,
                employee_id,
                details
            FROM
                storage_event_history
            WHERE
                storage_record_id = :record_id
            ORDER BY
                event_time;
        ''')
        params = {'record_id': record_id}
    with db_engine.connect() as conn:
        result = conn.execute(query, params)
        events = [dict(row) for row in result.mappings()]
    logger.info(
        "Fetched %s storage event(s) for storage_record_id=%s%s",
        len(events), record_id, f" (severity={severity})" if severity else ""
    )
    return jsonify(events)
