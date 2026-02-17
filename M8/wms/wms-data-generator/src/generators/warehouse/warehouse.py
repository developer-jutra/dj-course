from .locations import warehouse_location
from faker import Faker

fake = Faker()

the_only_warehouse = {
    'id': 1,
    'location_id': warehouse_location['id'],
    'name': "Main Deliveroo Warehouse",
    'description': "Main warehouse for Deliveroo in Poland"
}

def warehouse_insert_sql(warehouse):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    lines = [
        f"INSERT INTO warehouse (warehouse_id, location_id, name, description) VALUES\n"
        f"({warehouse['id']}, {warehouse['location_id']}, {sql_str(warehouse['name'])}, {sql_str(warehouse['description'])});",
    ]
    return "\n".join(lines)
