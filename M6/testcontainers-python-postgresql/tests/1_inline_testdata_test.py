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

def create_table(conn):
    with conn.cursor() as cursor:
        cursor.execute("""
            CREATE TABLE persons (
                id INT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                age INT NOT NULL
            );
        """)
    conn.commit()

def insert_mock_data(conn, data):
    with conn.cursor() as cursor:
        for person in data:
            cursor.execute(
                "INSERT INTO persons(id, name, age) VALUES (%s, %s, %s)",
                (person['id'], person['name'], person['age'])
            )
    conn.commit()


@pytest.fixture(scope="module")
def db_connection():
    with PostgresContainer("postgres:15-alpine") as postgres:
        # The get_connection_url() method returns a SQLAlchemy-compatible URL.
        # psycopg2 requires a standard DSN, so we need to remove the "+psycopg2" driver part.
        dsn = postgres.get_connection_url().replace("+psycopg2", "")
        db_client = DBClient(dsn)
        db_client.connect()
        create_table_sql = """
            CREATE TABLE persons (
                id INT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                age INT NOT NULL
            );
        """
        db_client.create_table(create_table_sql)
        insert_person_sql = "INSERT INTO persons(id, name, age) VALUES (%s, %s, %s)"
        db_client.insert_data(insert_person_sql, [(p['id'], p['name'], p['age']) for p in MOCK_DATA])
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
