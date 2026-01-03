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

@payments_bp.route('/<int:payment_id>', methods=['DELETE'])
def delete_payment(payment_id):
    with db_engine.connect() as conn:
        trans = conn.begin()
        try:
            query = text("DELETE FROM payment WHERE payment_id = :payment_id")
            result = conn.execute(query, {'payment_id': payment_id})
            
            if result.rowcount == 0:
                trans.rollback()
                logger.warning(f"Attempted to delete non-existing payment with ID: {payment_id}")
                return jsonify({'error': 'Payment not found'}), 404

            trans.commit()
            logger.info(f"Successfully deleted payment with ID: {payment_id}")
            return jsonify({'message': 'Payment deleted successfully'}), 200
        except Exception as e:
            trans.rollback()
            logger.error(f"Error deleting payment with ID {payment_id}: {e}")
            return jsonify({'error': 'Failed to delete payment'}), 500
