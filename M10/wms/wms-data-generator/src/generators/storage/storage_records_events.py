from faker import Faker
from src.config import DATA_QUANTITIES
from src.generators.enums import CARGO_EVENT_TYPES
import json
from datetime import timedelta
import random

fake = Faker()

def generate_cargo_events_history(storage_records, employee_parties):
    """Generate cargo event history records with party_id for employees"""
    events = []
    employee_ids = [p['party_id'] for p in employee_parties]
    
    for i in range(DATA_QUANTITIES["NUM_CARGO_EVENT_HISTORY"]):
        event_id = i + 1
        storage_record_id = storage_records[i % len(storage_records)]['id']
        event_type_id = CARGO_EVENT_TYPES[i % len(CARGO_EVENT_TYPES)]['id']
        event_time = fake.date_time_between(start_date='-30d', end_date='now')
        party_id = random.choice(employee_ids)  # Employee who performed the event
        details = json.dumps({
            "note": fake.sentence(nb_words=6),
            "performed_by": fake.name(),
            "location": fake.word()
        })
        
        events.append({
            'id': event_id,
            'party_id': party_id,
            'storage_record_id': storage_record_id,
            'event_type_id': event_type_id,
            'event_time': event_time,
            'details': details
        })
    return events

def cargo_events_history_insert_sql(cargo_events_history):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    def sql_timestamp(dt):
        return f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}'" if dt else "NULL"
    
    lines = ["INSERT INTO cargo_event_history (event_id, party_id, storage_record_id, event_type_id, event_time, details) VALUES"]
    lines.append(",\n".join(
        f"({ce['id']}, {ce['party_id']}, {ce['storage_record_id']}, {ce['event_type_id']}, {sql_timestamp(ce['event_time'])}, {sql_str(ce['details'])}::jsonb)" 
        for ce in cargo_events_history
    ) + ";")
    return "\n".join(lines)

def generate_storage_records(contractor_partiesies, storage_requests, shelves):
    fake = Faker()
    storage_records = []
    contractor_parties_ids = [p['party_id'] for p in contractor_partiesies]
    
    for i in range(DATA_QUANTITIES["NUM_STORAGE_RECORDS"]):
        id_ = i + 1
        request_id = storage_requests[i % DATA_QUANTITIES["NUM_STORAGE_REQUESTS"]]['id']
        party_id = random.choice(contractor_parties_ids)  # Use party_id for customer
        shelf_id = shelves[i % DATA_QUANTITIES["NUM_SHELVES"]]['id']
        actual_entry_date = fake.date_time_between(start_date='-30d', end_date='now')
        actual_exit_date = None if random.choice([True, False]) else actual_entry_date + timedelta(days=random.randint(1, 10))
        cargo_description = fake.sentence(nb_words=4)
        cargo_weight = round(random.uniform(100, 1000), 2)
        cargo_volume = round(random.uniform(1, 10), 2)
        
        storage_records.append({
            'id': id_,
            'request_id': request_id,
            'party_id': party_id,
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
    
    lines = ["INSERT INTO storage_record (storage_record_id, request_id, party_id, shelf_id, actual_entry_date, actual_exit_date, cargo_description, cargo_weight, cargo_volume) VALUES"]
    lines.append(",\n".join(
        f"({sr['id']}, {sr['request_id']}, {sr['party_id']}, {sr['shelf_id']}, {sql_timestamp(sr['actual_entry_date'])}, {sql_timestamp(sr['actual_exit_date']) if sr['actual_exit_date'] else 'NULL'}, {sql_str(sr['cargo_description'])}, {sr['cargo_weight']}, {sr['cargo_volume']})"
        for sr in storage_records
    ) + ";")
    return "\n".join(lines)
