from flask import Blueprint, jsonify
from application import logger
from sqlalchemy import text
from database import db_engine

storage_bp = Blueprint('storage_bp', __name__)

@storage_bp.route('/<int:record_id>/events', methods=['GET'])
def get_storage_event_history(record_id):
    """Return the event history for a given storage record.

    The SQL is sourced from `wms-data-generator/src/queries.md` (section: "storage event history for storage record").
    """
    query = text('''
        SELECT
            event_id,
            storage_record_id,
            event_type_id,
            event_time,
            party_id,
            details
        FROM
            cargo_event_history
        WHERE
            storage_record_id = :record_id
        ORDER BY
            event_time;
    ''')

    with db_engine.connect() as conn:
        result = conn.execute(query, {'record_id': record_id})
        events = [dict(row) for row in result.mappings()]

    logger.info(
        "Fetched %s storage event(s) for storage_record_id=%s", len(events), record_id
    )
    return jsonify(events)
