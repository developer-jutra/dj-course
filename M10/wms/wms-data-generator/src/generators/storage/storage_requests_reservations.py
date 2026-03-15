from faker import Faker
from datetime import timedelta
import random
from src.config import DATA_QUANTITIES
from src.generators.enums import ROLES

def generate_storage_requests(contractor_partiesies, employee_parties, warehouses):
    fake = Faker()
    storage_requests = []
    contractor_parties_ids = [p['party_id'] for p in contractor_partiesies]
    decision_makers = [p['party_id'] for p in employee_parties]
    
    for i in range(DATA_QUANTITIES["NUM_STORAGE_REQUESTS"]):
        id_ = i + 1
        issuing_party_id = random.choice(contractor_parties_ids)
        warehouse_id = warehouses[0]['id'] if warehouses else 1  # Use first warehouse or default to 1
        requested_entry_date = fake.date_time_between(start_date='-30d', end_date='+30d')
        requested_exit_date = requested_entry_date + timedelta(days=random.randint(5, 30))
        status = random.choice(['PENDING', 'ACCEPTED', 'REJECTED'])  # Uppercase
        
        if status == 'ACCEPTED':
            decisive_party_id = random.choice(decision_makers) if decision_makers else None
            decision_date = requested_entry_date - timedelta(days=random.randint(1, 5))
        elif status == 'REJECTED':
            decisive_party_id = random.choice(decision_makers) if decision_makers and random.random() > 0.3 else None
            decision_date = requested_entry_date - timedelta(days=random.randint(1, 3)) if decisive_party_id else requested_entry_date + timedelta(days=random.randint(0, 2))
        else:  # PENDING
            decisive_party_id = None
            decision_date = None
        
        storage_requests.append({
            'id': id_,
            'issuing_party_id': issuing_party_id,
            'warehouse_id': warehouse_id,
            'requested_entry_date': requested_entry_date,
            'requested_exit_date': requested_exit_date,
            'status': status,
            'decisive_party_id': decisive_party_id,
            'decision_date': decision_date
        })
    return storage_requests

def storage_requests_insert_sql(storage_requests):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    def sql_timestamp(dt):
        return f"'" + dt.strftime('%Y-%m-%d %H:%M:%S') + "'" if dt else "NULL"
    
    lines = ["INSERT INTO storage_request (request_id, warehouse_id, issuing_party_id, requested_entry_date, requested_exit_date, status, decisive_party_id, decision_date) VALUES"]
    lines.append(",\n".join(
        f"({sr['id']}, {sr['warehouse_id']}, {sr['issuing_party_id']}, {sql_timestamp(sr['requested_entry_date'])}, {sql_timestamp(sr['requested_exit_date'])}, {sql_str(sr['status'])}, {sr['decisive_party_id'] if sr['decisive_party_id'] else 'NULL'}, {sql_timestamp(sr['decision_date'])})"
        for sr in storage_requests
    ) + ";")
    return "\n".join(lines)

def generate_storage_reservations(contractor_partiesies, accepted_storage_requests, shelves):
    fake = Faker()
    storage_reservations = []
    
    for i, req in enumerate(accepted_storage_requests):
        id_ = i + 1
        request_id = req['id']
        party_id = req['issuing_party_id']  # Use the issuing party as the reservation party
        shelf_id = shelves[i % len(shelves)]['id']
        reserved_weight = random.randint(100, 1000)
        reserved_volume = round(random.uniform(1, 10), 2)
        reserved_from = req['entry']
        reserved_until = req['exit']
        status = 'ACTIVE'  # Uppercase
        
        storage_reservations.append({
            'id': id_,
            'request_id': request_id,
            'party_id': party_id,
            'shelf_id': shelf_id,
            'reserved_weight': reserved_weight,
            'reserved_volume': reserved_volume,
            'reserved_from': reserved_from,
            'reserved_until': reserved_until,
            'status': status
        })
    return storage_reservations

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
