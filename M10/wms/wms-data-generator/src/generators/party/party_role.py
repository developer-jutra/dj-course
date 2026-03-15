from typing import List, Dict

def party_roles_insert_sql(party_roles: List[Dict]) -> str:
    def sql_timestamp(dt):
        return f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}'" if dt else "NULL"
    lines = ["INSERT INTO party_role (party_id, role_id, assigned_date) VALUES"]
    lines.append(",\n".join(
        f"({pr['party_id']}, {pr['role_id']}, {sql_timestamp(pr['assigned_date'])})" for pr in party_roles
    ) + ";")
    return "\n".join(lines) 