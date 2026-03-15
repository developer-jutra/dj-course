from typing import List, Dict, Optional
from faker import Faker
import random
import uuid

fake = Faker()

def generate_addresses_for_parties(
    parties: List[Dict],
    min_per_party: int = 1,
    max_per_party: int = 3,
    address_types: Optional[List[str]] = None
) -> List[Dict]:
    """
    Generate address records for a list of parties.
    :param parties: List of party dicts (must have 'party_id')
    :param min_per_party: Minimum addresses per party
    :param max_per_party: Maximum addresses per party
    :param address_types: List of address types to use (default: ['CORPORATE', 'BILLING', 'SHIPPING', 'OTHER'])
    :return: List of address dicts
    """
    if address_types is None:
        address_types = ['CORPORATE', 'BILLING', 'SHIPPING', 'OTHER']
    addresses = []
    for party in parties:
        num_addresses = random.choices(
            list(range(min_per_party, max_per_party + 1)),
            weights=[0.6, 0.3, 0.1][:max_per_party],
            k=1
        )[0]
        used_types = []
        for _ in range(num_addresses):
            available_types = [t for t in address_types if t not in used_types]
            if not available_types:
                break
            address_type = random.choice(available_types)
            used_types.append(address_type)
            addresses.append({
                'address_id': str(uuid.uuid4()),
                'party_id': party['party_id'],
                'street_address': fake.street_address(),
                'city': fake.city(),
                'country': fake.country(),
                'postal_code': fake.postcode(),
                'address_type': address_type
            })
    return addresses

def addresses_insert_sql(addresses: List[Dict]) -> str:
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    lines = ["INSERT INTO address (address_id, party_id, street_address, city, country, postal_code, address_type) VALUES"]
    lines.append(",\n".join(
        f"({sql_str(addr['address_id'])}, {addr['party_id']}, {sql_str(addr['street_address'])}, {sql_str(addr['city'])}, {sql_str(addr['country'])}, {sql_str(addr['postal_code'])}, {sql_str(addr['address_type'])})"
        for addr in addresses
    ) + ";")
    return "\n".join(lines) 