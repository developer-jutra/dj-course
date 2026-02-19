from .warehouse_structure import (
    zones_insert_sql, ZONE_NAMES,
    generate_aisles, aisles_insert_sql,
    generate_racks, racks_insert_sql,
    generate_shelves, shelves_insert_sql,
    generate_capacity, capacity_insert_sql,
)
from src.result_composite import ResultComposite

def generate_warehouse_structure():
    result = ResultComposite()
    
    zones = ZONE_NAMES
    result.add_line("\n-- Zones")
    result.add_line(zones_insert_sql(zones))
    result.add_data('zones', zones)

    aisles = generate_aisles(zones)
    result.add_line("\n-- Aisles")
    result.add_line(aisles_insert_sql(aisles))
    result.add_data('aisles', aisles)

    racks = generate_racks(aisles)
    result.add_line("\n-- Racks")
    result.add_line(racks_insert_sql(racks))
    result.add_data('racks', racks)

    shelves = generate_shelves(racks)
    result.add_line("\n-- Shelves")
    result.add_line(shelves_insert_sql(shelves))
    result.add_data('shelves', shelves)

    capacities = generate_capacity(zones, racks, shelves)
    result.add_line("\n-- Capacity")
    result.add_line(capacity_insert_sql(capacities))
    result.add_data('capacity', capacities)

    return result
