from .storage_requests_reservations import generate_storage_requests, storage_requests_insert_sql
from .storage_records_events import generate_storage_records, storage_records_insert_sql, generate_cargo_events_history, cargo_events_history_insert_sql
from src.result_composite import ResultComposite
from faker import Faker
from datetime import timedelta
import random

def generate_storage_data(contractor_parties, employee_parties):
    result = ResultComposite()
    fake = Faker()
    
    # For now, use a simple warehouse structure - this should be passed from main generator
    warehouses = [{'id': 1}]  # Placeholder
    shelves = [{'id': i} for i in range(1, 16)]  # Placeholder
    
    # --- Storage Requests ---
    storage_requests = generate_storage_requests(contractor_parties, employee_parties, warehouses)
    result.add_line("\n-- Storage Requests")
    result.add_line(storage_requests_insert_sql(storage_requests))
    result.add_data('storage_requests', storage_requests)
    
    # --- Storage Reservations ---
    # Only generate reservations for accepted requests
    accepted_requests = [sr for sr in storage_requests if sr['status'] == 'ACCEPTED']
    storage_reservations = []
    for i, request in enumerate(accepted_requests):
        if random.random() < 0.3:  # 30% of accepted requests get reservations
            storage_reservations.append({
                'id': i + 1,
                'request_id': request['id'],
                'party_id': request['issuing_party_id'],
                'shelf_id': random.choice(shelves)['id'],
                'reserved_weight': round(random.uniform(100, 1000), 2),
                'reserved_volume': round(random.uniform(1, 10), 2),
                'reserved_from': request['requested_entry_date'],
                'reserved_until': request['requested_exit_date'],
                'status': random.choice(['PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED'])
            })
    result.add_line("\n-- Storage Reservations")
    result.add_line(storage_reservations_insert_sql(storage_reservations))
    result.add_data('storage_reservations', storage_reservations)
    
    # --- Storage Records ---
    # Only generate records for reservations (1:1 with accepted requests)
    storage_records = []
    for i, reservation in enumerate(storage_reservations):
        id_ = i + 1
        request_id = reservation['request_id']
        party_id = reservation['party_id']  # Use party_id now
        shelf_id = reservation['shelf_id']
        actual_entry_date = reservation['reserved_from']
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
    result.add_line("\n-- Storage Records")
    result.add_line(storage_records_insert_sql(storage_records))
    result.add_data('storage_records', storage_records)
    
    # --- Cargo Event History ---
    cargo_event_history = generate_cargo_events_history(storage_records, employee_parties)
    result.add_line("\n-- Cargo Event History")
    result.add_line(cargo_events_history_insert_sql(cargo_event_history))
    result.add_data('cargo_event_history', cargo_event_history)
    
    return result

def storage_reservations_insert_sql(storage_reservations):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    def sql_timestamp(dt):
        return f"'" + dt.strftime('%Y-%m-%d %H:%M:%S') + "'" if dt else "NULL"
    
    lines = ["INSERT INTO storage_reservation (reservation_id, request_id, party_id, shelf_id, reserved_weight, reserved_volume, reserved_from, reserved_until, status) VALUES"]
    lines.append(",\n".join(
        f"({sr['id']}, {sr['request_id']}, {sr['party_id']}, {sr['shelf_id']}, {sr['reserved_weight']}, {sr['reserved_volume']}, {sql_timestamp(sr['reserved_from'])}, {sql_timestamp(sr['reserved_until'])}, {sql_str(sr['status'])})"
        for sr in storage_reservations
    ) + ";")
    return "\n".join(lines)
