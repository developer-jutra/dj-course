from faker import Faker
from src.config import DATA_QUANTITIES
import random
import re

fake = Faker()

def company_name_to_domain(name):
    name = re.sub(r',?\s+(Inc|LLC|PLC|Ltd)\.?$', '', name, flags=re.I)
    domain = name.lower().strip()
    domain = re.sub(r'[^a-z0-9\s-]', '', domain)
    domain = re.sub(r'\s+', '-', domain)
    return f"{domain}.com"

def customers_insert_sql(customers):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    def sql_timestamp(dt):
        return f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}'" if dt else "NULL"

    lines = ["INSERT INTO customer (customer_id, name, email, phone, status, tax_id_number, is_deleted, created_at, updated_at) VALUES"]
    lines.append(",\n".join(
        f"({c['customer_id']}, {sql_str(c['name'])}, {sql_str(c['email'])}, {sql_str(c['phone'])}, {sql_str(c['status'])}, {sql_str(c['tax_id_number']) if c['tax_id_number'] else 'NULL'}, {str(c['is_deleted']).upper()}, {sql_timestamp(c['created_at'])}, {sql_timestamp(c['updated_at'])})"
        for c in customers
    ) + ";")
    return "\n".join(lines)

def generate_customers():
    """Generate customer records"""
    customers = []
    for i in range(DATA_QUANTITIES["NUM_CONTRACTORS"]):
        customer_id = i + 1
        company_name = fake.company()
        domain = company_name_to_domain(company_name)
        
        customers.append({
            'customer_id': customer_id,
            'name': company_name,
            'email': f"info@{domain}",
            'phone': fake.phone_number(),
            'status': random.choices(['active', 'inactive'], weights=[0.9, 0.1])[0],
            'tax_id_number': fake.bothify(text='##########') if random.random() > 0.1 else None,
            'is_deleted': False,
            'created_at': fake.date_time_between(start_date='-2y', end_date='now'),
            'updated_at': fake.date_time_between(start_date='-1y', end_date='now'),
            'domain': domain  # For internal use with employee generation
        })
    return customers

def generate_customer_employees(customers, start_employee_id=None):
    """Generate customer employee records (representatives/contacts).
    start_employee_id: first ID to use (default: NUM_EMPLOYEES+1 so customer employees come after warehouse employees)
    """
    employees = []
    if start_employee_id is None:
        start_employee_id = DATA_QUANTITIES["NUM_EMPLOYEES"] + 1
    employee_id_counter = start_employee_id

    for customer in customers:
        num_employees = random.randint(0, 3)
        for _ in range(num_employees):
            employee_name = fake.name()
            name_parts = employee_name.lower().split()
            email_user = f"{name_parts[0]}.{name_parts[-1]}"
            
            employees.append({
                'customer_id': customer['customer_id'],
                'employee_id': employee_id_counter,
                'name': employee_name,
                'email': f"{email_user}@{customer['domain']}",
                'phone': fake.phone_number(),
                'job_title': fake.job(),
                'employee_type': 'representative'
            })
            employee_id_counter += 1
            
    return employees

def customer_employees_insert_sql(employees):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
        
    # First insert into employee table
    employee_lines = ["INSERT INTO employee (employee_id, name, email, phone, hire_date, is_deleted) VALUES"]
    employee_lines.append(",\n".join(
        f"({e['employee_id']}, {sql_str(e['name'])}, {sql_str(e['email'])}, {sql_str(e['phone'])}, CURRENT_DATE, false)"
        for e in employees
    ) + ";")
    
    # Then insert into customer_employee junction table
    junction_lines = ["INSERT INTO customer_employee (customer_id, employee_id, job_title, employee_type) VALUES"]
    junction_lines.append(",\n".join(
        f"({e['customer_id']}, {e['employee_id']}, {sql_str(e['job_title'])}, {sql_str(e['employee_type'])})"
        for e in employees
    ) + ";")
    
    return "\n".join(employee_lines) + "\n\n" + "\n".join(junction_lines)

def generate_customer_contacts(customers):
    """Generate contact details for customers"""
    contacts = []
    for customer in customers:
        contacts.append({
            'customer_id': customer['customer_id'],
            'type': 'EMAIL',
            'details': customer['email']
        })
        contacts.append({
            'customer_id': customer['customer_id'],
            'type': 'billing_email',
            'details': customer['email']
        })
        if random.random() < 0.8:
            contacts.append({
                'customer_id': customer['customer_id'],
                'type': 'PHONE',
                'details': customer['phone']
            })
    return contacts

def customer_contacts_insert_sql(contacts):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"

    lines = ["INSERT INTO customer_contact (customer_id, type, details) VALUES"]
    lines.append(",\n".join(
        f"({contact['customer_id']}, {sql_str(contact['type'])}, {sql_str(contact['details'])})"
        for contact in contacts
    ) + ";")
    return "\n".join(lines)
