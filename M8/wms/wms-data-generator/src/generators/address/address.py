from typing import List, Dict, Optional
from faker import Faker
import random

fake = Faker()

def generate_customer_addresses(
    customers: List[Dict],
    min_per_customer: int = 1,
    max_per_customer: int = 3,
    address_types: Optional[List[str]] = None
) -> List[Dict]:
    """
    Generate address records for a list of customers.
    :param customers: List of customer dicts (must have 'customer_id')
    :param min_per_customer: Minimum addresses per customer
    :param max_per_customer: Maximum addresses per customer
    :param address_types: List of address types to use (default: ['CORPORATE', 'BILLING', 'SHIPPING', 'OTHER'])
    :return: List of address dicts
    """
    if address_types is None:
        address_types = ['CORPORATE', 'BILLING', 'SHIPPING', 'OTHER']
    addresses = []
    required_mocks_assigned = False
    
    for customer in customers:
        num_addresses = random.choices(
            list(range(min_per_customer, max_per_customer + 1)),
            weights=[0.6, 0.3, 0.1][:max_per_customer],
            k=1
        )[0]
        used_types = []
        for _ in range(num_addresses):
            available_types = [t for t in address_types if t not in used_types]
            if not available_types:
                break
            address_type = random.choice(available_types)
            used_types.append(address_type)
            
            if not required_mocks_assigned and address_type == 'CORPORATE':
                city = 'Kraków'
                country = 'Poland'
                postal_code = fake.bothify(text='##-###')
                required_mocks_assigned = True
            else:
                city = fake.city()
                country = fake.country()
                postal_code = fake.postcode()
            
            addresses.append({
                'customer_id': customer['customer_id'],
                'street_address': fake.street_address(),
                'city': city,
                'country': country,
                'postal_code': postal_code,
                'address_type': address_type
            })
    return addresses

def customer_addresses_insert_sql(addresses: List[Dict]) -> str:
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    lines = ["INSERT INTO customer_address (customer_id, street_address, city, country, postal_code, address_type) VALUES"]
    lines.append(",\n".join(
        f"({addr['customer_id']}, {sql_str(addr['street_address'])}, {sql_str(addr['city'])}, {sql_str(addr['country'])}, {sql_str(addr['postal_code'])}, {sql_str(addr['address_type'])})"
        for addr in addresses
    ) + ";")
    return "\n".join(lines)
