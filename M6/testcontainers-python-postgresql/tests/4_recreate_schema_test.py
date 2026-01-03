import os
import pytest
import time
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
def container():
    # Start a single container per module to avoid expensive restarts
    sql_script_path = os.path.join(os.path.dirname(__file__), 'data.sql')
    with PostgresContainer("postgres:15-alpine") \
            .with_volume_mapping(os.path.dirname(sql_script_path), "/docker-entrypoint-initdb.d") as postgres:
        dsn = postgres.get_connection_url().replace("+psycopg2", "")
        yield dsn


@pytest.fixture(scope="function")
def db_connection(container):
    # Create a fresh schema per test, seed it from data.sql and set search_path
    dsn = container
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cursor = conn.cursor()

    # create unique schema
    schema_name = f"test_schema_{int(time.time() * 1000)}_{os.urandom(4).hex()}"

    cursor.execute(f"CREATE SCHEMA {schema_name}")
    cursor.execute(f"SET search_path TO {schema_name}")

    # Read seed SQL and transform to schema-qualified statements
    sql_script_path = os.path.join(os.path.dirname(__file__), 'data.sql')
    with open(sql_script_path, 'r') as f:
        seed_sql = f.read()

    # Naive transformations: remove DROP TABLEs, qualify CREATE TABLE and INSERT INTO
    transformed = (seed_sql
        .replace('DROP TABLE IF EXISTS persons;', '')
        .replace('CREATE TABLE persons', f'CREATE TABLE {schema_name}.persons')
        .replace('INSERT INTO persons', f'INSERT INTO {schema_name}.persons'))

    # Execute each statement separately
    for stmt in [s.strip() for s in transformed.split(';') if s.strip()]:
        cursor.execute(stmt)

    # Provide DBClient connected to the same connection
    db_client = DBClient(dsn)
    db_client.conn = conn
    yield db_client
    # Drop the schema to clean up
    cursor.execute(f"DROP SCHEMA IF EXISTS {schema_name} CASCADE")
    cursor.close()
    conn.close()

def test_should_insert_new_person_and_fetch(db_connection):
    # insert new person id=11, name=Kate, age=32
    insert_sql = "INSERT INTO persons (id, name, age) VALUES (%s, %s, %s)"
    # DBClient provides execute_query for executing statements
    db_connection.execute_query(insert_sql, [11, 'Kate', 32])

    # fetch the inserted row
    result = db_connection.fetch_all("SELECT * FROM persons WHERE id = %s", [11])
    assert result == [{'id': 11, 'name': 'Kate', 'age': 32}]

def test_should_fetch_all_mock_persons_from_database(db_connection):
    result_dicts = db_connection.fetch_all("SELECT * FROM persons ORDER BY id")

    assert len(result_dicts) == len(MOCK_DATA)
    assert result_dicts == MOCK_DATA

def test_should_fetch_persons_older_than_30(db_connection):
    result_dicts = db_connection.fetch_all("SELECT * FROM persons WHERE age > %s ORDER BY id", [30])
        
    expected = [p for p in MOCK_DATA if p['age'] > 30]
    assert result_dicts == expected
