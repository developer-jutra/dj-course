from .employees import (
    generate_parties_for_employees,
    generate_employees,
    generate_party_roles, 
    generate_employee_warehouses, employee_warehouses_insert_sql,
    generate_party_contacts_for_employees
)
from src.generators.contractors.contractors import party_contacts_insert_sql
from src.generators.enums import ROLES
from src.result_composite import ResultComposite
from src.generators.address.address import generate_addresses_for_parties, addresses_insert_sql
from src.generators.party.party import parties_insert_sql
from src.generators.party.party_role import party_roles_insert_sql

def generate_employees_data():
    result = ResultComposite()
    
    # --- Employee Parties ---
    employee_parties = generate_parties_for_employees()
    result.add_line("\n-- Employee Parties")
    result.add_line(parties_insert_sql(employee_parties))
    result.add_data('employee_parties', employee_parties)
    
    # --- Employee Addresses ---
    employee_addresses = generate_addresses_for_parties(
        employee_parties,
        address_types=['PERSONAL', 'OTHER']
    )
    result.add_line("\n-- Employee Addresses")
    result.add_line(addresses_insert_sql(employee_addresses))
    result.add_data('employee_addresses', employee_addresses)
    
    # --- Employee Contacts ---
    employee_contacts = generate_party_contacts_for_employees(employee_parties)
    result.add_line("\n-- Employee Contacts")
    result.add_line(party_contacts_insert_sql(employee_contacts))
    result.add_data('employee_contacts', employee_contacts)
    
    # --- Party Roles ---
    party_roles = generate_party_roles(employee_parties, ROLES)
    result.add_line("\n-- Party Roles")
    result.add_line(party_roles_insert_sql(party_roles))
    result.add_data('party_roles', party_roles)
    
    # --- Employee Warehouses ---
    employee_warehouses = generate_employee_warehouses(employee_parties)
    result.add_line("\n-- Employee Warehouses")
    result.add_line(employee_warehouses_insert_sql(employee_warehouses))
    result.add_data('employee_warehouses', employee_warehouses)
    
    return result
