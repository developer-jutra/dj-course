from faker import Faker
from src.config import DATA_QUANTITIES
from src.generators.enums import ROLES
from src.generators.warehouse import the_only_warehouse
from src.generators.party.party import parties_insert_sql
from src.generators.party.party_role import party_roles_insert_sql
from src.generators.address.address import generate_addresses_for_parties, addresses_insert_sql
import random

fake = Faker()

def generate_parties_for_employees():
    """Generate party records for employees with employee data in JSONB data column"""
    parties = []
    # Employee party_ids start after contractor party_ids
    start_id = DATA_QUANTITIES["NUM_CONTRACTORS"] + 1
    
    for i in range(DATA_QUANTITIES["NUM_EMPLOYEES"]):
        party_id = start_id + i
        
        # Employee-specific data to store in JSONB data column
        employee_data = {
            'type': 'employee',
            'status': random.choices(['ACTIVE', 'INACTIVE'], weights=[0.95, 0.05])[0]
        }
        
        parties.append({
            'party_id': party_id,
            'name': fake.name(),
            'contact_email': fake.email(),
            'contact_phone': fake.phone_number(),
            'data': employee_data,
            'created_at': fake.date_time_between(start_date='-5y', end_date='-1y'),
            'updated_at': fake.date_time_between(start_date='-1y', end_date='now')
        })
    return parties

def generate_party_contacts_for_employees(parties):
    """Generate contact details for parties"""
    contacts = []
    for party in parties:
        contacts.append({
            'party_id': party['party_id'],
            'type': 'EMAIL',
            'details': party['contact_email']
        })
        contacts.append({
            'party_id': party['party_id'],
            'type': 'PHONE',
            'details': party['contact_phone']
        })
    return contacts

def generate_employees(parties):
    """Generate employee records that reference party records (for backward compatibility)"""
    employees = []
    for party in parties:
        employees.append({
            'party_id': party['party_id'],
            'status': party['data']['status']
        })
    return employees

def employees_insert_sql(employees):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    
    lines = ["INSERT INTO employee (party_id, status) VALUES"]
    lines.append(",\n".join(
        f"({employee['party_id']}, {sql_str(employee['status'])})"
        for employee in employees
    ) + ";")
    return "\n".join(lines)

def generate_party_roles(employee_parties, roles):
    import numpy as np
    ROLE_WEIGHTS = {
        1: 0.02,   # DIRECTOR
        2: 0.05,   # WAREHOUSE_MANAGER
        3: 0.15,   # LOGISTICS_COORDINATOR
        4: 0.18,   # STORAGE_APPROVER
        5: 0.60    # OPERATOR
    }
    role_ids = [role['id'] for role in roles]
    probabilities = [ROLE_WEIGHTS[rid] for rid in role_ids]
    party_roles = []
    
    for party in employee_parties:
        # Base role assignment
        base_role = int(np.random.choice(role_ids, p=probabilities))
        party_roles.append({
            'party_id': party['party_id'],
            'role_id': base_role,
            'assigned_date': fake.date_time_between(start_date=party['created_at'], end_date='now')
        })
        
        # 20% chance of secondary role
        if random.random() < 0.2:
            secondary_choices = [rid for rid in role_ids if rid != base_role]
            secondary_probs = [ROLE_WEIGHTS[rid] for rid in secondary_choices]
            secondary_probs = [p/sum(secondary_probs) for p in secondary_probs]
            secondary_role = int(np.random.choice(secondary_choices, p=secondary_probs))
            party_roles.append({
                'party_id': party['party_id'],
                'role_id': secondary_role,
                'assigned_date': fake.date_time_between(start_date=party['created_at'], end_date='now')
            })
    return party_roles

def employee_warehouses_insert_sql(employee_warehouses):
    def sql_timestamp(dt):
        return f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}'" if dt else "NULL"
    
    lines = ["INSERT INTO employee_warehouse (party_id, warehouse_id, assigned_from, assigned_until) VALUES"]
    lines.append(",\n".join(
        f"({ew['party_id']}, {ew['warehouse_id']}, {sql_timestamp(ew['assigned_from'])}, NULL)" for ew in employee_warehouses
    ) + ";")
    return "\n".join(lines)

def generate_employee_warehouses(employee_parties):
    # Assign all employees to the only warehouse, from their created date, with no assigned_until
    return [
        {
            'party_id': party['party_id'],
            'warehouse_id': the_only_warehouse['id'],
            'assigned_from': party['created_at'],
            'assigned_until': None
        }
        for party in employee_parties
    ]
