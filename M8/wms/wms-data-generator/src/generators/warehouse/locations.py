from faker import Faker

fake = Faker()

warehouse_location = {
    'id': 1,
    'address': 'ul. Wichrowa 89',
    'city': 'Janki',
    'postal_code': '05-090',
    'country': 'Poland'
}

def random_location():
    return {
        'id': 1,
        'address': fake.street_address(),
        'city': fake.city(),
        'postal_code': fake.postcode(),
        'country': fake.country()
    }

def location_insert_sql(location):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    lines = [
        f"INSERT INTO location (location_id, address, city, postal_code, country) VALUES\n"
        f"({location['id']}, {sql_str(location['address'])}, {sql_str(location['city'])}, "
        f"{sql_str(location['postal_code'])}, {sql_str(location['country'])});"
    ]
    return "\n".join(lines)
