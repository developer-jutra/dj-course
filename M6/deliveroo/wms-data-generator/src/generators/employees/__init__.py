from .employees import (
    generate_employees,
    generate_employee_roles,
    generate_employee_warehouses,
    employees_insert_sql,
    employee_roles_insert_sql,
    employee_warehouses_insert_sql
)
from src.generators.enums import ROLES
from src.result_composite import ResultComposite

def generate_employees_data():
    result = ResultComposite()
    
    # --- Employees ---
    employees = generate_employees()
    result.add_line("\n-- Employees")
    result.add_line(employees_insert_sql(employees))
    result.add_data('employees', employees)
    
    # --- Employee Roles ---
    employee_roles = generate_employee_roles(employees, ROLES)
    result.add_line("\n-- Employee Roles")
    result.add_line(employee_roles_insert_sql(employee_roles))
    result.add_data('employee_roles', employee_roles)
    
    # --- Employee Warehouses ---
    employee_warehouses = generate_employee_warehouses(employees)
    result.add_line("\n-- Employee Warehouses")
    result.add_line(employee_warehouses_insert_sql(employee_warehouses))
    result.add_data('employee_warehouses', employee_warehouses)
    
    return result
