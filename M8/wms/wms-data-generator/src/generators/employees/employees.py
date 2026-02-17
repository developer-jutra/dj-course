from faker import Faker
from src.config import DATA_QUANTITIES
from src.generators.enums import ROLES
from src.generators.warehouse import the_only_warehouse
import random

fake = Faker()

def generate_employees():
    """Generate warehouse employee records (IDs 1..NUM_EMPLOYEES)"""
    employees = []
    for i in range(DATA_QUANTITIES["NUM_EMPLOYEES"]):
        employee_id = i + 1
        
        employees.append({
            'employee_id': employee_id,
            'name': fake.name(),
            'email': fake.email(),
            'phone': fake.phone_number(),
            'hire_date': fake.date_between(start_date='-5y', end_date='-1y'),
            'is_deleted': False,
            'created_at': fake.date_time_between(start_date='-5y', end_date='-1y')
        })
    return employees

def employees_insert_sql(employees):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    def sql_date(dt):
        return f"'{dt.strftime('%Y-%m-%d')}'" if hasattr(dt, 'strftime') else f"'{dt}'"
    
    lines = ["INSERT INTO employee (employee_id, name, email, phone, hire_date, is_deleted) VALUES"]
    lines.append(",\n".join(
        f"({employee['employee_id']}, {sql_str(employee['name'])}, {sql_str(employee['email'])}, {sql_str(employee['phone'])}, {sql_date(employee['hire_date'])}, {str(employee['is_deleted']).upper()})"
        for employee in employees
    ) + ";")
    return "\n".join(lines)

def generate_employee_roles(employees, roles):
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
    employee_roles = []
    
    for employee in employees:
        # Base role assignment
        base_role = int(np.random.choice(role_ids, p=probabilities))
        employee_roles.append({
            'employee_id': employee['employee_id'],
            'role_id': base_role,
            'assigned_date': employee['hire_date']
        })
        
        # 20% chance of secondary role
        if random.random() < 0.2:
            secondary_choices = [rid for rid in role_ids if rid != base_role]
            secondary_probs = [ROLE_WEIGHTS[rid] for rid in secondary_choices]
            secondary_probs = [p/sum(secondary_probs) for p in secondary_probs]
            secondary_role = int(np.random.choice(secondary_choices, p=secondary_probs))
            employee_roles.append({
                'employee_id': employee['employee_id'],
                'role_id': secondary_role,
                'assigned_date': employee['hire_date']
            })
    return employee_roles

def employee_roles_insert_sql(employee_roles):
    def sql_date(dt):
        return f"'{dt.strftime('%Y-%m-%d')}'" if hasattr(dt, 'strftime') else f"'{dt}'"
    
    lines = ["INSERT INTO employee_role (employee_id, role_id, assigned_date) VALUES"]
    lines.append(",\n".join(
        f"({er['employee_id']}, {er['role_id']}, {sql_date(er['assigned_date'])})"
        for er in employee_roles
    ) + ";")
    return "\n".join(lines)

def generate_employee_warehouses(employees):
    """Assign all employees to the only warehouse"""
    return [
        {
            'employee_id': employee['employee_id'],
            'warehouse_id': the_only_warehouse['id'],
            'assigned_from': employee['hire_date'],
            'assigned_until': None
        }
        for employee in employees
    ]

def employee_warehouses_insert_sql(employee_warehouses):
    def sql_date(dt):
        return f"'{dt.strftime('%Y-%m-%d')}'" if hasattr(dt, 'strftime') else f"'{dt}'"
    
    lines = ["INSERT INTO employee_warehouse (employee_id, warehouse_id, assigned_from, assigned_until) VALUES"]
    lines.append(",\n".join(
        f"({ew['employee_id']}, {ew['warehouse_id']}, {sql_date(ew['assigned_from'])}, NULL)"
        for ew in employee_warehouses
    ) + ";")
    return "\n".join(lines)
