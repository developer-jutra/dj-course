ROLES = [
    {'id': 1, 'name': 'DIRECTOR', 'description': 'Executive director overseeing all warehouse operations and strategic planning.'},
    {'id': 2, 'name': 'WAREHOUSE_MANAGER', 'description': 'Oversees all warehouse operations, staff management, and safety protocols.'},
    {'id': 3, 'name': 'LOGISTICS_COORDINATOR', 'description': 'Manages logistics, distribution processes, and supply chain coordination.'},
    {'id': 4, 'name': 'STORAGE_APPROVER', 'description': 'Reviews and approves storage requests and reservation decisions.'},
    {'id': 5, 'name': 'OPERATOR', 'description': 'Handles day-to-day warehouse operations including receiving, shipping, and inventory management.'}
]

STORAGE_EVENT_TYPES = [
    {'id': 1, 'name': 'RECEIVED', 'description': 'Cargo received at warehouse'},
    {'id': 2, 'name': 'MOVED', 'description': 'Cargo moved to another shelf'},
    {'id': 3, 'name': 'DISPATCHED', 'description': 'Cargo dispatched from warehouse'},
    {'id': 4, 'name': 'DAMAGED', 'description': 'Cargo found damaged'},
    {'id': 5, 'name': 'LOST', 'description': 'Cargo missing or lost'},
    {'id': 6, 'name': 'CONTRACTOR_CONTACT', 'description': 'Contact with contractor regarding storage'},
    {'id': 7, 'name': 'QUALITY_ISSUE', 'description': 'Quality-related issue reported'},
    {'id': 8, 'name': 'SAFETY_INCIDENT', 'description': 'Safety or accident incident reported'}
]

def sql_str(s):
    return "'" + str(s).replace("'", "''") + "'"

def roles_insert_sql():
    lines = ["INSERT INTO role (role_id, name, description) VALUES"]
    lines.append(",\n".join(
        f"({role['id']}, {sql_str(role['name'])}, {sql_str(role['description'])})" for role in ROLES
    ) + ";")
    return "\n".join(lines)

def storage_event_types_insert_sql():
    lines = ["INSERT INTO storage_event_type (event_type_id, name, description) VALUES"]
    lines.append(",\n".join(
        f"({event['id']}, {sql_str(event['name'])}, {sql_str(event['description'])})" for event in STORAGE_EVENT_TYPES
    ) + ";")
    return "\n".join(lines)
