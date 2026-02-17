from faker import Faker
from datetime import datetime, timedelta
import random
import json
from src.config import DATA_QUANTITIES
from src.result_composite import ResultComposite
from src.generators.warehouse import the_only_warehouse
from src.generators.warehouse import generate_warehouse_and_location
from src.generators.warehouse_structure import generate_warehouse_structure
from src.generators.contractors import generate_contractors_data
from src.generators.employees import generate_employees_data
from src.generators.payments import generate_payments_data
from src.generators.storage import generate_storage_data
from src.generators.enums import ROLES, STORAGE_EVENT_TYPES, roles_insert_sql, storage_event_types_insert_sql

fake = Faker()

def generate_sql_inserts():
    result = ResultComposite()

    # --- Warehouse (Locations + Warehouses) ---
    warehouse_result = generate_warehouse_and_location()
    result.merge_with(warehouse_result)

    # --- Roles ---
    result.add_data('roles', ROLES)
    result.add_line("\n-- Roles")
    result.add_line(roles_insert_sql())

    # --- Employees (Employees + Roles + Warehouses) - IDs 1..NUM_EMPLOYEES, before contractors ---
    employees_result = generate_employees_data()
    result.merge_with(employees_result)

    # --- Contractors (Customers + Customer Employees + Addresses + Contacts) ---
    # Customer employees use IDs NUM_EMPLOYEES+1, ... to avoid conflicts
    contractors_result = generate_contractors_data()
    result.merge_with(contractors_result)

    # --- Storage Event Types ---
    result.add_data('storage_event_types', STORAGE_EVENT_TYPES)
    result.add_line("\n-- Storage Event Types")
    result.add_line(storage_event_types_insert_sql())

    # --- Warehouse Structure ---
    warehouse_structure_result = generate_warehouse_structure()
    result.merge_with(warehouse_structure_result)

    # --- Storage (includes Storage Requests, Reservations, Records, and Event History) ---
    storage_result = generate_storage_data(
        result.data['customers'], 
        result.data['employees']
    )
    result.merge_with(storage_result)

    # --- Payments ---
    payments_result = generate_payments_data(result.data['customers'], result.data['storage_records'])
    result.merge_with(payments_result)

    return result
