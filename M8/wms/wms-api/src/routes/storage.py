from flask import Blueprint, jsonify, request
from application import logger
from sqlalchemy import text
from database import db_engine
from decimal import Decimal
import json

storage_bp = Blueprint('storage_bp', __name__)


def _serialize(row):
    """Coerce a DB row mapping into a JSON-safe dict (Decimal -> float)."""
    out = {}
    for key, value in row.items():
        out[key] = float(value) if isinstance(value, Decimal) else value
    return out


def _coerce_filter_value(raw):
    """Coerce a query-string value to its JSON type for JSONB containment."""
    low = raw.lower()
    if low in ('true', 'false'):
        return low == 'true'
    try:
        return int(raw)
    except ValueError:
        pass
    try:
        return float(raw)
    except ValueError:
        pass
    return raw


def _employee_id_from_request():
    """Read the acting employee id from the X-Employee-Id header ('' if absent)."""
    return (request.headers.get('X-Employee-Id') or '').strip()

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


# --- Cargo "technical passport" (JSONB metadata) endpoints --------------------

@storage_bp.route('/cargo', methods=['POST'])
def register_cargo():
    """Register new cargo. Maps name->cargo_description, weight->cargo_weight;
    cargo_volume is taken from metadata.volume when present (dynamic attribute)."""
    body = request.get_json(silent=True) or {}
    required = ('name', 'category_id', 'weight', 'request_id', 'customer_id', 'shelf_id')
    missing = [f for f in required if body.get(f) is None]
    if missing:
        return jsonify({'error': f"Missing required fields: {', '.join(missing)}"}), 400

    metadata = body.get('metadata') or {}
    cargo_volume = metadata.get('volume', body.get('volume', 0))
    query = text('''
        INSERT INTO storage_record (
            request_id, customer_id, shelf_id, actual_entry_date,
            cargo_description, cargo_weight, cargo_volume, category_id, metadata
        ) VALUES (
            :request_id, :customer_id, :shelf_id, now(),
            :name, :weight, :cargo_volume, :category_id, CAST(:metadata AS jsonb)
        )
        RETURNING storage_record_id;
    ''')
    params = {
        'request_id': body['request_id'],
        'customer_id': body['customer_id'],
        'shelf_id': body['shelf_id'],
        'name': body['name'],
        'weight': body['weight'],
        'cargo_volume': cargo_volume,
        'category_id': body['category_id'],
        'metadata': json.dumps(metadata),
    }
    with db_engine.begin() as conn:
        new_id = conn.execute(query, params).scalar_one()
    logger.info("Registered cargo storage_record_id=%s", new_id)
    return jsonify({'storage_record_id': new_id}), 201


@storage_bp.route('/cargo/search', methods=['GET'])
def search_cargo():
    """Search cargo by metadata containment, e.g. /cargo/search?fragile=true (uses GIN)."""
    filt = {k: _coerce_filter_value(v) for k, v in request.args.items()}
    if not filt:
        return jsonify([])
    query = text('''
        SELECT storage_record_id, category_id, cargo_description, cargo_weight, metadata
        FROM storage_record
        WHERE metadata @> CAST(:filt AS jsonb)
        LIMIT 100;
    ''')
    with db_engine.connect() as conn:
        result = conn.execute(query, {'filt': json.dumps(filt)})
        rows = [_serialize(row) for row in result.mappings()]
    logger.info("Cargo search %s -> %s row(s)", filt, len(rows))
    return jsonify(rows)


@storage_bp.route('/cargo/stats', methods=['GET'])
def cargo_stats():
    """Aggregate weight for cargo with a given firmware version (uses expression index)."""
    firmware = request.args.get('firmware')
    if not firmware:
        return jsonify({'error': "Missing required query param: firmware"}), 400
    query = text('''
        SELECT COALESCE(SUM(cargo_weight), 0) AS total_weight, COUNT(*) AS count
        FROM storage_record
        WHERE metadata->>'firmware_version' = :firmware;
    ''')
    with db_engine.connect() as conn:
        row = conn.execute(query, {'firmware': firmware}).mappings().first()
    logger.info("Cargo stats firmware=%s -> count=%s", firmware, row['count'])
    return jsonify(_serialize(row))


@storage_bp.route('/cargo/<int:cargo_id>', methods=['GET'])
def get_cargo_details(cargo_id):
    """Fetch cargo details with category name and full metadata."""
    query = text('''
        SELECT sr.storage_record_id, sr.cargo_description, sr.cargo_weight,
               sr.cargo_volume, sr.category_id, c.name AS category_name, sr.metadata
        FROM storage_record sr
        LEFT JOIN category c ON c.category_id = sr.category_id
        WHERE sr.storage_record_id = :cargo_id;
    ''')
    with db_engine.connect() as conn:
        row = conn.execute(query, {'cargo_id': cargo_id}).mappings().first()
    if row is None:
        return jsonify({'error': 'Cargo not found'}), 404
    return jsonify(_serialize(row))


@storage_bp.route('/cargo/<int:cargo_id>/metadata', methods=['PATCH'])
def update_cargo_metadata(cargo_id):
    """Partial update: merge the request body into existing metadata (JSONB ||)."""
    patch = request.get_json(silent=True)
    if not isinstance(patch, dict) or not patch:
        return jsonify({'error': 'Request body must be a non-empty JSON object'}), 400
    query = text('''
        UPDATE storage_record
        SET metadata = metadata || CAST(:patch AS jsonb)
        WHERE storage_record_id = :cargo_id
        RETURNING metadata;
    ''')
    with db_engine.begin() as conn:
        conn.execute(text("SELECT set_config('wms.employee_id', :emp, true)"),
                     {'emp': _employee_id_from_request()})
        row = conn.execute(query, {'patch': json.dumps(patch), 'cargo_id': cargo_id}).mappings().first()
    if row is None:
        return jsonify({'error': 'Cargo not found'}), 404
    logger.info("Patched metadata for storage_record_id=%s", cargo_id)
    return jsonify(_serialize(row))


@storage_bp.route('/cargo/<int:cargo_id>/metadata/<key>', methods=['DELETE'])
def delete_cargo_metadata_key(cargo_id, key):
    """Remove a single key from metadata (JSONB - 'key')."""
    query = text('''
        UPDATE storage_record
        SET metadata = metadata - :key
        WHERE storage_record_id = :cargo_id
        RETURNING metadata;
    ''')
    with db_engine.begin() as conn:
        conn.execute(text("SELECT set_config('wms.employee_id', :emp, true)"),
                     {'emp': _employee_id_from_request()})
        row = conn.execute(query, {'key': key, 'cargo_id': cargo_id}).mappings().first()
    if row is None:
        return jsonify({'error': 'Cargo not found'}), 404
    logger.info("Removed metadata key '%s' from storage_record_id=%s", key, cargo_id)
    return jsonify(_serialize(row))


@storage_bp.route('/cargo/<int:cargo_id>/history', methods=['GET'])
def get_cargo_metadata_history(cargo_id):
    """Audit log: metadata snapshots before/after each change (uses history index)."""
    query = text('''
        SELECT history_id, changed_at, employee_id, old_metadata, new_metadata
        FROM storage_metadata_history
        WHERE storage_record_id = :cargo_id
        ORDER BY changed_at DESC;
    ''')
    with db_engine.connect() as conn:
        result = conn.execute(query, {'cargo_id': cargo_id})
        history = [_serialize(row) for row in result.mappings()]
    logger.info("Fetched %s history entr(ies) for storage_record_id=%s", len(history), cargo_id)
    return jsonify(history)
