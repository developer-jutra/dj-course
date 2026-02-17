from flask import Blueprint, jsonify, request
from application import logger
from sqlalchemy import text
from database import db_engine

payments_bp = Blueprint('payments_bp', __name__)

@payments_bp.route('/', methods=['GET'])
def get_payments_list():
    status = request.args.get('status', None)
    if status:
        status = status.lower()
    customer_id = request.args.get('customer_id', None)
    min_amount = request.args.get('min_amount', None)
    
    base_query = '''
        SELECT
            payment_id,
            storage_record_id,
            customer_id,
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
    if customer_id:
        filters.append('customer_id = :customer_id')
        params['customer_id'] = customer_id
    if min_amount is not None:
        try:
            min_amount_val = float(min_amount)
            filters.append('amount > :min_amount')
            params['min_amount'] = min_amount_val
        except (ValueError, TypeError):
            pass
    if filters:
        base_query += ' WHERE ' + ' AND '.join(filters)
    base_query += '\nORDER BY payment_date NULLS LAST, payment_id;'
    query = text(base_query)
    with db_engine.connect() as conn:
        result = conn.execute(query, params)
        payments = [dict(row) for row in result.mappings()]
    logger.info(f"Fetched {len(payments)} payments with filters: status={status}, customer_id={customer_id}, min_amount={min_amount}")
    return jsonify(payments)
