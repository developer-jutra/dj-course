from faker import Faker
from typing import List, Dict
import json

fake = Faker()

def parties_insert_sql(parties: List[Dict]) -> str:
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    def sql_timestamp(dt):
        return f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}'" if dt else "NULL"
    def sql_jsonb(data):
        if data is None:
            return "NULL"
        return "'" + json.dumps(data).replace("'", "''") + "'::jsonb"
    
    lines = ["INSERT INTO party (party_id, name, data, created_at, updated_at) VALUES"]
    lines.append(",\n".join(
        f"({party['party_id']}, {sql_str(party['name'])}, {sql_jsonb(party.get('data'))}, {sql_timestamp(party['created_at'])}, {sql_timestamp(party['updated_at'])})"
        for party in parties
    ) + ";")
    return "\n".join(lines) 