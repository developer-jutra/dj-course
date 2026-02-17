from faker import Faker
from datetime import timedelta
import random
from src.config import DATA_QUANTITIES
from src.generators.enums import ROLES

def generate_storage_requests(customers, employees, warehouses):
    fake = Faker()
    storage_requests = []
    customer_ids = [c['customer_id'] for c in customers]
    decision_makers = [e['employee_id'] for e in employees]
    
    for i in range(DATA_QUANTITIES["NUM_STORAGE_REQUESTS"]):
        id_ = i + 1
        customer_id = random.choice(customer_ids)
        warehouse_id = warehouses[0]['id'] if warehouses else 1  # Use first warehouse or default to 1
        requested_entry_date = fake.date_time_between(start_date='-30d', end_date='+30d')
        requested_exit_date = requested_entry_date + timedelta(days=random.randint(5, 30))
        status = random.choice(['pending', 'accepted', 'rejected'])
        
        if status == 'accepted':
            decision_employee_id = random.choice(decision_makers) if decision_makers else None
            decision_date = requested_entry_date - timedelta(days=random.randint(1, 5))
        elif status == 'rejected':
            decision_employee_id = random.choice(decision_makers) if decision_makers and random.random() > 0.3 else None
            decision_date = requested_entry_date - timedelta(days=random.randint(1, 3)) if decision_employee_id else requested_entry_date + timedelta(days=random.randint(0, 2))
        else:  # pending
            decision_employee_id = None
            decision_date = None
        
        storage_requests.append({
            'id': id_,
            'customer_id': customer_id,
            'warehouse_id': warehouse_id,
            'requested_entry_date': requested_entry_date,
            'requested_exit_date': requested_exit_date,
            'status': status,
            'decision_employee_id': decision_employee_id,
            'decision_date': decision_date
        })
    return storage_requests

def storage_requests_insert_sql(storage_requests):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    def sql_timestamp(dt):
        return f"'" + dt.strftime('%Y-%m-%d %H:%M:%S') + "'" if dt else "NULL"
    
    lines = ["INSERT INTO storage_request (request_id, customer_id, warehouse_id, requested_entry_date, requested_exit_date, status, decision_employee_id, decision_date) VALUES"]
    lines.append(",\n".join(
        f"({sr['id']}, {sr['customer_id']}, {sr['warehouse_id']}, {sql_timestamp(sr['requested_entry_date'])}, {sql_timestamp(sr['requested_exit_date'])}, {sql_str(sr['status'])}, {sr['decision_employee_id'] if sr['decision_employee_id'] else 'NULL'}, {sql_timestamp(sr['decision_date'])})"
        for sr in storage_requests
    ) + ";")
    return "\n".join(lines)

def generate_storage_reservations(customers, accepted_storage_requests, shelves):
    fake = Faker()
    storage_reservations = []
    
    for i, req in enumerate(accepted_storage_requests):
        id_ = i + 1
        request_id = req['id']
        customer_id = req['customer_id']
        shelf_id = shelves[i % len(shelves)]['id']
        reserved_weight = random.randint(100, 1000)
        reserved_volume = round(random.uniform(1, 10), 2)
        reserved_from = req['requested_entry_date']
        reserved_until = req['requested_exit_date']
        status = random.choice(['pending', 'active', 'expired', 'cancelled'])
        
        storage_reservations.append({
            'id': id_,
            'request_id': request_id,
            'customer_id': customer_id,
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
    
    lines = ["INSERT INTO storage_reservation (reservation_id, request_id, customer_id, shelf_id, reserved_weight, reserved_volume, reserved_from, reserved_until, status) VALUES"]
    lines.append(",\n".join(
        f"({sr['id']}, {sr['request_id']}, {sr['customer_id']}, {sr['shelf_id']}, {sr['reserved_weight']}, {sr['reserved_volume']}, {sql_timestamp(sr['reserved_from'])}, {sql_timestamp(sr['reserved_until'])}, {sql_str(sr['status'])})"
        for sr in storage_reservations
    ) + ";")
    return "\n".join(lines)
