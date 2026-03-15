from faker import Faker
from src.config import DATA_QUANTITIES
import random
from src.generators.address.address import generate_addresses_for_parties, addresses_insert_sql
import json
import re

fake = Faker()

def company_name_to_domain(name):
    name = re.sub(r',?\\s+(Inc|LLC|PLC|Ltd)\\.?$', '', name, flags=re.I)
    domain = name.lower().strip()
    domain = re.sub(r'[^a-z0-9\\s-]', '', domain)
    domain = re.sub(r'\\s+', '-', domain)
    return f"{domain}.com"

def parties_insert_sql(parties):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"

    def sql_jsonb(data):
        if data is None:
            return "NULL"
        return "'" + json.dumps(data).replace("'", "''") + "'::jsonb"

    lines = ["INSERT INTO party (party_id, name, data, created_at, updated_at) VALUES"]
    lines.append(",\n".join(
        f"({party['party_id']}, {sql_str(party['name'])}, {sql_jsonb(party['data'])}, '{party['created_at']}', '{party['updated_at']}')"
        for party in parties
    ) + ";")
    return "\n".join(lines)

def generate_contractor_company_parties():
    """Generate party records for contractor companies with contractor data in JSONB data column"""
    parties = []
    for i in range(DATA_QUANTITIES["NUM_CONTRACTORS"]):
        party_id = i + 1
        company_name = fake.company()
        domain = company_name_to_domain(company_name)
        
        contractor_data = {
            'type': 'contractor_company',
            'tax_id_number': fake.bothify(text='##########') if random.random() > 0.1 else None,
            'status': random.choices(['ACTIVE', 'INACTIVE'], weights=[0.9, 0.1])[0]
        }
        
        parties.append({
            'party_id': party_id,
            'name': company_name,
            'domain': domain,
            'data': contractor_data,
            'created_at': fake.date_time_between(start_date='-2y', end_date='now'),
            'updated_at': fake.date_time_between(start_date='-1y', end_date='now')
        })
    return parties

def generate_contractor_employee_parties(contractor_parties):
    """Generate party records for employees of contractor companies"""
    employee_parties = []
    party_id_counter = DATA_QUANTITIES["NUM_CONTRACTORS"] + DATA_QUANTITIES["NUM_EMPLOYEES"] + 1

    for contractor_party in contractor_parties:
        num_employees = random.randint(0, 3)
        for _ in range(num_employees):
            employee_name = fake.name()
            employee_data = {
                'type': 'contractor_employee',
                'job_title': fake.job()
            }
            employee_parties.append({
                'party_id': party_id_counter,
                'contractor_party_id': contractor_party['party_id'],
                'name': employee_name,
                'domain': contractor_party['domain'],
                'data': employee_data,
                'created_at': fake.date_time_between(start_date='-1y', end_date='now'),
                'updated_at': fake.date_time_between(start_date='-6m', end_date='now')
            })
            party_id_counter += 1
            
    return employee_parties

def generate_party_relationships(employee_parties):
    """Generate party relationships linking employees to their companies"""
    relationships = []
    for employee in employee_parties:
        relationships.append({
            'party_id_primary': employee['contractor_party_id'],
            'party_id_secondary': employee['party_id'],
            'relationship_type': 'REPRESENTATIVE',
            'valid_from': fake.date_time_between(start_date='-1y', end_date='now')
        })
    return relationships

def party_relationships_insert_sql(relationships):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
        
    lines = ["INSERT INTO party_relationship (party_id_primary, party_id_secondary, relationship_type, valid_from) VALUES"]
    lines.append(",\n".join(
        f"({rel['party_id_primary']}, {rel['party_id_secondary']}, {sql_str(rel['relationship_type'])}, '{rel['valid_from']}')"
        for rel in relationships
    ) + ";")
    return "\n".join(lines)

def generate_party_contacts(parties):
    """Generate contact details for parties"""
    contacts = []
    for party in parties:
        party_type = party['data']['type']
        domain = party['domain']

        if party_type == 'contractor_employee':
            name_parts = party['name'].lower().split()
            email_user = f"{name_parts[0]}.{name_parts[-1]}"
            email = f"{email_user}@{domain}"
        else:  # contractor_company
            email = f"info@{domain}"
            
        contacts.append({
            'party_id': party['party_id'],
            'type': 'EMAIL',
            'details': email
        })
        if random.random() < 0.8:
            contacts.append({
                'party_id': party['party_id'],
                'type': 'PHONE',
                'details': fake.phone_number()
            })
    return contacts

def party_contacts_insert_sql(contacts):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"

    lines = ["INSERT INTO party_contact (party_id, type, details) VALUES"]
    lines.append(",\n".join(
        f"({contact['party_id']}, {sql_str(contact['type'])}, {sql_str(contact['details'])})"
        for contact in contacts
    ) + ";")
    return "\n".join(lines)
