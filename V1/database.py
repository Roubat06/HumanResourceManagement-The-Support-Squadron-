import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import config

def create_master_database_if_not_exists() -> bool:
    """
    Connects to the default PostgreSQL database to check if 'hrms_master' exists.
    If it is missing, it creates it.
    Returns True if a new database was created, False if it already existed.
    """
    # Connect to the default 'postgres' database
    conn = psycopg2.connect(
        dbname="postgres",
        user=config.DB_USER,
        password=config.DB_PASSWORD,
        host=config.DB_HOST,
        port=config.DB_PORT
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Check if master database exists
    cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{config.MASTER_DB_NAME}'")
    exists = cursor.fetchone()
    
    created = False
    if not exists:
        cursor.execute(f"CREATE DATABASE {config.MASTER_DB_NAME}")
        created = True
        
    cursor.close()
    conn.close()
    
    return created

def get_master_engine():
    """Returns a SQLAlchemy engine connected to the master database."""
    connection_string = (
        f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}"
        f"@{config.DB_HOST}:{config.DB_PORT}/{config.MASTER_DB_NAME}"
    )
    return create_engine(connection_string)

def get_master_session_local():
    """Returns a sessionmaker instance for the master database."""
    engine = get_master_engine()
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)
