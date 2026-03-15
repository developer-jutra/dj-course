from flask import Blueprint, jsonify, request
from application import logger
from sqlalchemy import text
from database import db_engine

payments_bp = Blueprint('payments_bp', __name__)

@payments_bp.route('/', methods=['GET'])
def get_payments_list():
    status = request.args.get('status', None)
    party_id = request.args.get('party_id', None)
    
    base_query = '''
        SELECT
            payment_id,
            storage_record_id,
            party_id,
            amount,
            currency,
            status,
            payment_date,
            external_reference
        FROM
            payment
    '''
    filters = []
    params = {}
    if status:
        filters.append('status = :status')
        params['status'] = status
    if party_id:
        filters.append('party_id = :party_id')
        params['party_id'] = party_id
    if filters:
        base_query += ' WHERE ' + ' AND '.join(filters)
    base_query += '\nORDER BY payment_date NULLS LAST, payment_id;'
    query = text(base_query)
    with db_engine.connect() as conn:
        result = conn.execute(query, params)
        payments = [dict(row) for row in result.mappings()]
    logger.info(f"Fetched {len(payments)} payments with filters: status={status}, party_id={party_id}")
    return jsonify(payments)
