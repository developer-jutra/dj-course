from .contractors import (
    generate_contractor_company_parties, 
    generate_contractor_employee_parties,
    generate_party_relationships,
    party_relationships_insert_sql,
    generate_party_contacts,
    party_contacts_insert_sql,
    parties_insert_sql
)
from src.generators.address.address import generate_addresses_for_parties, addresses_insert_sql
from src.result_composite import ResultComposite

def generate_contractors_data():
    result = ResultComposite()
    
    # --- Contractor Parties (Companies) ---
    contractor_company_parties = generate_contractor_company_parties()
    
    # --- Contractor Employee Parties ---
    contractor_employee_parties = generate_contractor_employee_parties(contractor_company_parties)
    
    # --- All Contractor-related Parties ---
    all_contractor_parties = contractor_company_parties + contractor_employee_parties
    result.add_line("\n-- Contractor and Employee Parties")
    result.add_line(parties_insert_sql(all_contractor_parties))
    result.add_data('contractor_parties', all_contractor_parties)
    
    # --- Party Relationships ---
    party_relationships = generate_party_relationships(contractor_employee_parties)
    result.add_line("\n-- Party Relationships")
    result.add_line(party_relationships_insert_sql(party_relationships))
    result.add_data('party_relationships', party_relationships)
    
    # --- Party Contacts ---
    party_contacts = generate_party_contacts(all_contractor_parties)
    result.add_line("\n-- Party Contacts")
    result.add_line(party_contacts_insert_sql(party_contacts))
    result.add_data('party_contacts', party_contacts)
    
    # --- Contractor Addresses (for Companies) ---
    contractor_addresses = generate_addresses_for_parties(
        contractor_company_parties, 
        address_types=['CORPORATE', 'BILLING', 'SHIPPING', 'OTHER']
    )
    result.add_line("\n-- Contractor Addresses")
    result.add_line(addresses_insert_sql(contractor_addresses))
    result.add_data('contractor_addresses', contractor_addresses)
    
    return result
