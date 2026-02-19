from src.config import DATA_QUANTITIES
from src.generators.warehouse import the_only_warehouse
import random
from faker import Faker

fake = Faker()

# Static zones, but warehouse_id is dynamic
ZONE_NAMES = [
    {'id': 1, 'warehouse_id': the_only_warehouse['id'], 'name': 'Bulk Storage Area', 'description': 'Area for storing large quantities of goods, usually on pallets.'},
    {'id': 2, 'warehouse_id': the_only_warehouse['id'], 'name': 'Receiving Area', 'description': 'Zone designated for unloading and inspecting incoming goods.'},
    {'id': 3, 'warehouse_id': the_only_warehouse['id'], 'name': 'Picking Area', 'description': 'Zone where items are picked to fulfill orders.'},
    {'id': 4, 'warehouse_id': the_only_warehouse['id'], 'name': 'Packing Area', 'description': 'Area for packing picked items and preparing them for shipment.'},
    {'id': 5, 'warehouse_id': the_only_warehouse['id'], 'name': 'Shipping Area', 'description': 'Zone for staging and loading outbound shipments.'},
    {'id': 6, 'warehouse_id': the_only_warehouse['id'], 'name': 'Returns Area', 'description': 'Designated space for processing returned goods.'},
    {'id': 7, 'warehouse_id': the_only_warehouse['id'], 'name': 'Quarantine/Inspection Area', 'description': 'Area for holding goods pending inspection or quality checks.'}
]

# ZONE_NAMES are used to run this function, fix this
def zones_insert_sql(zones):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    lines = ["INSERT INTO zone (zone_id, warehouse_id, name, description) VALUES"]
    lines.append(",\n".join(
        f"({zone['id']}, {zone['warehouse_id']}, {sql_str(zone['name'])}, {sql_str(zone['description'])})" for zone in zones
    ) + ";")
    return "\n".join(lines)

def generate_aisles(zones):
    # Only for Bulk Storage Area (zone name)
    bulk_zone = next(z for z in zones if z['name'] == 'Bulk Storage Area')
    return [
        {
            'id': i + 1,
            'zone_id': bulk_zone['id'],
            'label': f"Aisle-{i+1}",
            'width': random.choice([200, 250, 300, 350]),
            'width_unit': "cm"
        }
        for i in range(DATA_QUANTITIES["NUM_AISLES"])
    ]

def aisles_insert_sql(aisles):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    lines = ["INSERT INTO aisle (aisle_id, zone_id, label, width, width_unit) VALUES"]
    lines.append(",\n".join(
        f"({aisle['id']}, {aisle['zone_id']}, {sql_str(aisle['label'])}, {aisle['width']}, {sql_str(aisle['width_unit'])})" for aisle in aisles
    ) + ";")
    return "\n".join(lines)

def generate_racks(aisles):
    return [
        {
            'id': i + 1,
            'aisle_id': aisles[i % len(aisles)]['id'],
            'label': f"R-{i+1:03d}",
            'max_height': random.choice([350, 400, 450, 500]),
            'height_unit': "cm"
        }
        for i in range(DATA_QUANTITIES["NUM_RACKS"])
    ]

def racks_insert_sql(racks):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    lines = ["INSERT INTO rack (rack_id, aisle_id, label, max_height, height_unit) VALUES"]
    lines.append(",\n".join(
        f"({rack['id']}, {rack['aisle_id']}, {sql_str(rack['label'])}, {rack['max_height']}, {sql_str(rack['height_unit'])})" for rack in racks
    ) + ";")
    return "\n".join(lines)

def generate_shelves(racks):
    return [
        {
            'id': i + 1,
            'rack_id': racks[i % len(racks)]['id'],
            'level': str((i % 4) + 1),
            'max_weight': random.randint(600, 1200),
            'max_volume': random.randint(5, 15)
        }
        for i in range(DATA_QUANTITIES["NUM_SHELVES"])
    ]

def shelves_insert_sql(shelves):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    lines = ["INSERT INTO shelf (shelf_id, rack_id, level, max_weight, max_volume) VALUES"]
    lines.append(",\n".join(
        f"({shelf['id']}, {shelf['rack_id']}, {sql_str(shelf['level'])}, {shelf['max_weight']}, {shelf['max_volume']})" for shelf in shelves
    ) + ";")
    return "\n".join(lines)

def generate_capacity(zones, racks, shelves):
    capacities = []
    cap_id = 1
    capacities.append({
        'id': cap_id, 'entity_type': 'WAREHOUSE', 'entity_id': the_only_warehouse['id'],
        'value': 10000, 'unit': 'pallet', 'description': 'Total pallet positions'
    })
    cap_id += 1
    capacities.append({
        'id': cap_id, 'entity_type': 'WAREHOUSE', 'entity_id': the_only_warehouse['id'],
        'value': 50000, 'unit': 'm3', 'description': 'Total volume'
    })
    cap_id += 1
    for zone in zones:
        capacities.append({
            'id': cap_id, 'entity_type': 'ZONE', 'entity_id': zone['id'],
            'value': random.randint(500, 2000), 'unit': 'pallet', 'description': None
        })
        cap_id += 1
    for rack in racks[:3]:
        capacities.append({
            'id': cap_id, 'entity_type': 'RACK', 'entity_id': rack['id'],
            'value': random.randint(50, 150), 'unit': 'box', 'description': None
        })
        cap_id += 1
    for shelf in shelves[:5]:
        capacities.append({
            'id': cap_id, 'entity_type': 'SHELF', 'entity_id': shelf['id'],
            'value': random.randint(500, 1000), 'unit': 'kg', 'description': None
        })
        cap_id += 1
    return capacities

def capacity_insert_sql(capacities):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'" if s else 'NULL'
    lines = ["INSERT INTO capacity (capacity_id, entity_type, entity_id, value, unit, description) VALUES"]
    lines.append(",\n".join(
        f"({c['id']}, {sql_str(c['entity_type'])}, {c['entity_id']}, {c['value']}, {sql_str(c['unit'])}, {sql_str(c['description'])})"
        for c in capacities
    ) + ";")
    return "\n".join(lines)
