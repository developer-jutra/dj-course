import os
from sqlalchemy import create_engine
from env import assert_env_var

assert_env_var('POSTGRES_URL')
DB_URL = os.environ.get('POSTGRES_URL')

db_engine = create_engine(
    DB_URL,
    # if we want to configure the connection pool:
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
    pool_pre_ping=True
)
