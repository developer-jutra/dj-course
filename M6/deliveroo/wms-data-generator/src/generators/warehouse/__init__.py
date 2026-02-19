from .locations import warehouse_location, location_insert_sql
from .warehouse import the_only_warehouse, warehouse_insert_sql
from src.result_composite import ResultComposite

def generate_warehouse_and_location():
    result = ResultComposite()

    # --- Locations ---
    result.add_line("-- Locations")
    result.add_line(location_insert_sql(warehouse_location))
    result.add_data('locations', [warehouse_location])

    # --- Warehouses ---
    result.add_line("\n-- Warehouses")
    result.add_line(warehouse_insert_sql(the_only_warehouse))
    result.add_data('warehouses', [the_only_warehouse])

    return result
