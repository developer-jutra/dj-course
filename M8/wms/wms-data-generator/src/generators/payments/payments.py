from faker import Faker
from datetime import datetime
import random
from src.config import DATA_QUANTITIES

PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'cancelled']


def generate_payments(customers, storage_records):
    fake = Faker()
    payments = []
    customer_ids = [c['customer_id'] for c in customers]
    
    if not storage_records:
        raise ValueError("Cannot generate payments: storage_records list is empty")
    
    for i in range(DATA_QUANTITIES["NUM_PAYMENTS"]):
        id_ = i + 1
        storage_record_id = storage_records[i % len(storage_records)]['id']
        # Cycle through statuses so all are represented; first pending goes to customer 1 for API examples
        status = PAYMENT_STATUSES[i % len(PAYMENT_STATUSES)]
        if status == 'pending' and i == 0:
            customer_id = 1  # Ensure customer 1 has pending payment for .http examples
        else:
            customer_id = random.choice(customer_ids)
        amount = round(random.uniform(500, 2000), 2)
        currency = random.choice(['USD', 'EUR', 'PLN'])
        payment_date = None if status == 'pending' else fake.date_time_between(start_date='-30d', end_date='now')
        external_reference = f"PAY-{datetime.now().strftime('%Y%m%d')}-{i+1:04d}"
        
        payments.append({
            'id': id_,
            'storage_record_id': storage_record_id,
            'customer_id': customer_id,
            'amount': amount,
            'currency': currency,
            'status': status,
            'payment_date': payment_date,
            'external_reference': external_reference
        })
    return payments

def payments_insert_sql(payments):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    def sql_timestamp(dt):
        return f"'" + dt.strftime('%Y-%m-%d %H:%M:%S') + "'" if dt else "NULL"
    
    lines = ["INSERT INTO payment (payment_id, storage_record_id, customer_id, amount, currency, status, payment_date, external_reference) VALUES"]
    lines.append(",\n".join(
        f"({p['id']}, {p['storage_record_id']}, {p['customer_id']}, {p['amount']}, {sql_str(p['currency'])}, {sql_str(p['status'])}, {sql_timestamp(p['payment_date']) if p['payment_date'] else 'NULL'}, {sql_str(p['external_reference'])})"
        for p in payments
    ) + ";")
    return "\n".join(lines)
