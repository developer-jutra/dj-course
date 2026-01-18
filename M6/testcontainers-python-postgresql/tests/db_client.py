
import psycopg2
import psycopg2.extras

class DBClient:
    def __init__(self, dsn):
        self.dsn = dsn
        self.conn = None

    def connect(self):
        self.conn = psycopg2.connect(self.dsn)

    def close(self):
        if self.conn:
            self.conn.close()

    def execute_query(self, query, params=None, fetch_results=False):
        if not self.conn:
            self.connect()
        with self.conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute(query, params)
            if fetch_results:
                return [dict(row) for row in cursor.fetchall()]
            self.conn.commit()

    def fetch_all(self, query, params=None):
        if not self.conn:
            self.connect()
        with self.conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute(query, params)
            return [dict(row) for row in cursor.fetchall()]

    def create_table(self, sql_script):
        if not self.conn:
            self.connect()
        with self.conn.cursor() as cursor:
            cursor.execute(sql_script)
        self.conn.commit()

    def insert_data(self, query, data):
        if not self.conn:
            self.connect()
        with self.conn.cursor() as cursor:
            for item in data:
                cursor.execute(query, item)
        self.conn.commit()
