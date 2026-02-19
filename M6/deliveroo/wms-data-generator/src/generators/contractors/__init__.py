from .contractors import (
    generate_customers,
    generate_customer_employees,
    generate_customer_contacts,
    customers_insert_sql,
    customer_employees_insert_sql,
    customer_contacts_insert_sql
)
from src.result_composite import ResultComposite

def generate_contractors_data():
    result = ResultComposite()
    
    # --- Customers (Companies) ---
    customers = generate_customers()
    result.add_line("\n-- Customers")
    result.add_line(customers_insert_sql(customers))
    result.add_data('customers', customers)
    
    # --- Customer Employees (Representatives) ---
    customer_employees = generate_customer_employees(customers)
    if customer_employees:
        result.add_line("\n-- Customer Employees")
        result.add_line(customer_employees_insert_sql(customer_employees))
        result.add_data('customer_employees', customer_employees)
    
    # --- Customer Contacts ---
    customer_contacts = generate_customer_contacts(customers)
    result.add_line("\n-- Customer Contacts")
    result.add_line(customer_contacts_insert_sql(customer_contacts))
    result.add_data('customer_contacts', customer_contacts)
    
    # --- Customer Addresses ---
    from src.generators.address.address import generate_customer_addresses, customer_addresses_insert_sql
    customer_addresses = generate_customer_addresses(
        customers, 
        address_types=['CORPORATE', 'BILLING', 'SHIPPING', 'OTHER']
    )
    result.add_line("\n-- Customer Addresses")
    result.add_line(customer_addresses_insert_sql(customer_addresses))
    result.add_data('customer_addresses', customer_addresses)
    
    return result
