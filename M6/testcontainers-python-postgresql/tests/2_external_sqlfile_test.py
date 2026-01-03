import os
import pytest
import psycopg2
import psycopg2.extras
from testcontainers.postgres import PostgresContainer
from .db_client import DBClient

MOCK_DATA = [
    {'id': 1, 'name': 'Alice', 'age': 30},
    {'id': 2, 'name': 'Bob', 'age': 24},
    {'id': 3, 'name': 'Charlie', 'age': 28},
    {'id': 4, 'name': 'Diana', 'age': 35},
    {'id': 5, 'name': 'Eve', 'age': 22},
    {'id': 6, 'name': 'Frank', 'age': 33},
    {'id': 7, 'name': 'Grace', 'age': 27},
    {'id': 8, 'name': 'Hank', 'age': 31},
    {'id': 9, 'name': 'Ivy', 'age': 29},
    {'id': 10, 'name': 'Jack', 'age': 26},
]

@pytest.fixture(scope="module")
def db_connection():
    sql_script_path = os.path.join(os.path.dirname(__file__), 'data.sql')
    
    with PostgresContainer("postgres:15-alpine") \
            .with_volume_mapping(os.path.dirname(sql_script_path), "/docker-entrypoint-initdb.d") as postgres:
        
        dsn = postgres.get_connection_url().replace("+psycopg2", "")
        conn = psycopg2.connect(dsn)
        db_client = DBClient(dsn)
        db_client.conn = conn # Assign the established connection
        yield db_client
        db_client.close()
        # use tenacity/retry for proper error handling
        # pytest.fail("Could not connect to the database")
        
def test_should_fetch_all_mock_persons_from_database(db_connection):
    result_dicts = db_connection.fetch_all("SELECT * FROM persons ORDER BY id")

    assert len(result_dicts) == len(MOCK_DATA)
    assert result_dicts == MOCK_DATA


def test_should_fetch_persons_older_than_30(db_connection):
    result_dicts = db_connection.fetch_all("SELECT * FROM persons WHERE age > %s ORDER BY id", [30])
        
    expected = [p for p in MOCK_DATA if p['age'] > 30]
    assert result_dicts == expected
