import os
import pytest
import psycopg2
import psycopg2.extras
from testcontainers.core.container import DockerContainer
from testcontainers.core.waiting_utils import wait_for_logs
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
    postgres_user = "test"
    postgres_password = "test"
    postgres_db = "test"
    postgres_port = 5432

    with DockerContainer("postgres:15-alpine") \
            .with_env("POSTGRES_USER", postgres_user) \
            .with_env("POSTGRES_PASSWORD", postgres_password) \
            .with_env("POSTGRES_DB", postgres_db) \
            .with_exposed_ports(postgres_port) \
            .with_volume_mapping(os.path.join(os.path.dirname(__file__), 'data.sql'), '/docker-entrypoint-initdb.d/data.sql') as postgres_container:
        
        postgres_container.start()
        wait_for_logs(postgres_container, "database system is ready to accept connections", timeout=60)

        host = postgres_container.get_container_host_ip()
        port = postgres_container.get_exposed_port(postgres_port)

        dsn = f"postgresql://{postgres_user}:{postgres_password}@{host}:{port}/{postgres_db}"
        db_client = DBClient(dsn)
        db_client.connect()
        yield db_client
        db_client.close()

def test_should_fetch_all_mock_persons_from_database(db_connection):
    result_dicts = db_connection.fetch_all("SELECT * FROM persons ORDER BY id")
    assert len(result_dicts) == len(MOCK_DATA)
    assert result_dicts == MOCK_DATA

def test_should_fetch_persons_older_than_30(db_connection):
    result_dicts = db_connection.fetch_all("SELECT * FROM persons WHERE age > %s ORDER BY id", [30])
    expected = [p for p in MOCK_DATA if p['age'] > 30]
    assert result_dicts == expected
