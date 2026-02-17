from faker import Faker
from src.config import DATA_QUANTITIES
from src.generators.enums import STORAGE_EVENT_TYPES
import json
from datetime import timedelta
import random

fake = Faker()

def generate_storage_event_history(storage_records, employees):
    """Generate storage event history records with employee_id"""
    events = []
    employee_ids = [e['employee_id'] for e in employees]
    
    for i in range(DATA_QUANTITIES["NUM_CARGO_EVENT_HISTORY"]):
        event_id = i + 1
        storage_record_id = storage_records[i % len(storage_records)]['id']
        event_type_id = STORAGE_EVENT_TYPES[i % len(STORAGE_EVENT_TYPES)]['id']
        event_time = fake.date_time_between(start_date='-30d', end_date='now')
        employee_id = random.choice(employee_ids)
        severity = 'critical' if i == 0 else random.choice(['critical', 'warning', 'info'])
        details = json.dumps({
            "note": fake.sentence(nb_words=6),
            "performed_by": fake.name(),
            "location": fake.word(),
            "severity": severity
        })
        
        events.append({
            'id': event_id,
            'employee_id': employee_id,
            'storage_record_id': storage_record_id,
            'event_type_id': event_type_id,
            'event_time': event_time,
            'details': details
        })
    return events

def storage_event_history_insert_sql(event_history):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    def sql_timestamp(dt):
        return f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}'" if dt else "NULL"
    
    lines = ["INSERT INTO storage_event_history (event_id, storage_record_id, event_type_id, event_time, employee_id, details) VALUES"]
    lines.append(",\n".join(
        f"({e['id']}, {e['storage_record_id']}, {e['event_type_id']}, {sql_timestamp(e['event_time'])}, {e['employee_id']}, {sql_str(e['details'])}::jsonb)" 
        for e in event_history
    ) + ";")
    return "\n".join(lines)

CARGO_SAMPLE_DESCRIPTIONS = [
    "Electronics components shipment.",
    "Consumer electronics and accessories.",
    "Industrial machinery parts.",
]

def generate_storage_records(customers, storage_requests, shelves):
    fake = Faker()
    storage_records = []
    customer_ids = [c['customer_id'] for c in customers]
    
    for i in range(DATA_QUANTITIES["NUM_STORAGE_RECORDS"]):
        id_ = i + 1
        request_id = storage_requests[i % DATA_QUANTITIES["NUM_STORAGE_REQUESTS"]]['id']
        customer_id = random.choice(customer_ids)
        shelf_id = shelves[i % DATA_QUANTITIES["NUM_SHELVES"]]['id']
        actual_entry_date = fake.date_time_between(start_date='-30d', end_date='now')
        actual_exit_date = None if random.choice([True, False]) else actual_entry_date + timedelta(days=random.randint(1, 10))
        if i < len(CARGO_SAMPLE_DESCRIPTIONS):
            cargo_description = CARGO_SAMPLE_DESCRIPTIONS[i]
        else:
            cargo_description = fake.sentence(nb_words=4)
        cargo_weight = round(random.uniform(100, 1000), 2)
        cargo_volume = round(random.uniform(1, 10), 2)
        
        storage_records.append({
            'id': id_,
            'request_id': request_id,
            'customer_id': customer_id,
            'shelf_id': shelf_id,
            'actual_entry_date': actual_entry_date,
            'actual_exit_date': actual_exit_date,
            'cargo_description': cargo_description,
            'cargo_weight': cargo_weight,
            'cargo_volume': cargo_volume
        })
    return storage_records

def storage_records_insert_sql(storage_records):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    def sql_timestamp(dt):
        return f"'" + dt.strftime('%Y-%m-%d %H:%M:%S') + "'" if dt else "NULL"
    
    lines = ["INSERT INTO storage_record (storage_record_id, request_id, customer_id, shelf_id, actual_entry_date, actual_exit_date, cargo_description, cargo_weight, cargo_volume) VALUES"]
    lines.append(",\n".join(
        f"({sr['id']}, {sr['request_id']}, {sr['customer_id']}, {sr['shelf_id']}, {sql_timestamp(sr['actual_entry_date'])}, {sql_timestamp(sr['actual_exit_date']) if sr['actual_exit_date'] else 'NULL'}, {sql_str(sr['cargo_description'])}, {sr['cargo_weight']}, {sr['cargo_volume']})"
        for sr in storage_records
    ) + ";")
    return "\n".join(lines)
