import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import config
from company_models import CompanyBase, Employee, Security

def create_company_database(db_name: str) -> bool:
    """Creates a new PostgreSQL database for a company."""
    conn = psycopg2.connect(
        dbname="postgres",
        user=config.DB_USER,
        password=config.DB_PASSWORD,
        host=config.DB_HOST,
        port=config.DB_PORT
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Check if database exists
    cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{db_name}'")
    exists = cursor.fetchone()
    
    created = False
    if not exists:
        cursor.execute(f"CREATE DATABASE {db_name}")
        created = True
        
    cursor.close()
    conn.close()
    
    return created

def get_company_engine(db_name: str):
    """Creates a SQLAlchemy engine for a specific company database."""
    connection_string = (
        f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}"
        f"@{config.DB_HOST}:{config.DB_PORT}/{db_name}"
    )
    return create_engine(connection_string)


def run_company_migrations(engine):
    from sqlalchemy import text
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE departments ADD COLUMN IF NOT EXISTS description TEXT;"))
            conn.execute(text("ALTER TABLE departments ADD COLUMN IF NOT EXISTS head_id INTEGER;"))
            
            conn.execute(text("ALTER TABLE posts ADD COLUMN IF NOT EXISTS base_salary NUMERIC(10, 2) DEFAULT 0;"))
            conn.execute(text("ALTER TABLE posts ADD COLUMN IF NOT EXISTS increment NUMERIC(10, 2) DEFAULT 0;"))
            conn.execute(text("ALTER TABLE posts ADD COLUMN IF NOT EXISTS hra NUMERIC(10, 2) DEFAULT 0;"))
            conn.execute(text("ALTER TABLE posts ADD COLUMN IF NOT EXISTS allowance NUMERIC(10, 2) DEFAULT 0;"))
            conn.execute(text("ALTER TABLE posts ADD COLUMN IF NOT EXISTS pf NUMERIC(10, 2) DEFAULT 0;"))
            conn.execute(text("ALTER TABLE posts ADD COLUMN IF NOT EXISTS professional_tax NUMERIC(10, 2) DEFAULT 0;"))
            
            conn.execute(text("ALTER TABLE employees ADD COLUMN IF NOT EXISTS official_phone VARCHAR(50);"))
            conn.execute(text("ALTER TABLE employees ADD COLUMN IF NOT EXISTS department_id INTEGER;"))
            conn.execute(text("ALTER TABLE employees ADD COLUMN IF NOT EXISTS reporting_hr_id INTEGER;"))
            conn.execute(text("ALTER TABLE employees ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT TRUE;"))
            conn.execute(text("ALTER TABLE employees ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;"))
            
            conn.execute(text("ALTER TABLE personal_details ADD COLUMN IF NOT EXISTS gender VARCHAR(50);"))
            conn.execute(text("ALTER TABLE personal_details ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(255);"))
            conn.execute(text("ALTER TABLE personal_details ADD COLUMN IF NOT EXISTS personal_email VARCHAR(255);"))
            conn.execute(text("ALTER TABLE personal_details ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);"))
            conn.execute(text("ALTER TABLE personal_details ADD COLUMN IF NOT EXISTS marital_status VARCHAR(50);"))
            conn.execute(text("ALTER TABLE personal_details ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10);"))
            
            conn.execute(text("ALTER TABLE professional_details ADD COLUMN IF NOT EXISTS skills TEXT;"))
            conn.execute(text("ALTER TABLE professional_details ADD COLUMN IF NOT EXISTS about TEXT;"))
            conn.execute(text("ALTER TABLE professional_details ADD COLUMN IF NOT EXISTS pan VARCHAR(50);"))
            conn.execute(text("ALTER TABLE professional_details ADD COLUMN IF NOT EXISTS uan VARCHAR(50);"))
            
            conn.execute(text("ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS employee_id INTEGER;"))
            conn.commit()
        except Exception as e:
            pass

def initialize_company(db_name: str, admin_name: str, admin_email: str, password_hash: str):
    """Initializes the company database tables and creates the default admin employee."""
    # Create DB
    create_company_database(db_name)
    
    # Create engine and tables
    engine = get_company_engine(db_name)
    CompanyBase.metadata.create_all(bind=engine)
    
    run_company_migrations(engine)
    
    # Insert default Company Admin
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        admin_emp = db.query(Employee).filter(Employee.email == admin_email).first()
        if not admin_emp:
            # Basic parsing of name
            parts = admin_name.split(' ', 1)
            first_name = parts[0]
            last_name = parts[1] if len(parts) > 1 else ""
            
            new_admin = Employee(
                employee_code="ADM001",
                first_name=first_name,
                last_name=last_name,
                email=admin_email,
                role="COMPANY_ADMIN"
            )
            db.add(new_admin)
            db.flush() # Flush to get the inserted id
            
            security = Security(
                employee_id=new_admin.id,
                password_hash=password_hash
            )
            db.add(security)
            db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
