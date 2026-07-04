import sys
from sqlalchemy import inspect
import config
from database import create_master_database_if_not_exists, get_master_engine, get_master_session_local
from models import Base, SuperAdmin, AuditLog
from utils import hash_password

def initialize():
    print("==================================")
    print("HRMS Initialization")
    print("==================================\n")
    
    print("Checking PostgreSQL...\n")
    try:
        # Create database if it does not exist
        created = create_master_database_if_not_exists()
        print("Connected\n")
    except Exception as e:
        print(f"Failed to connect to PostgreSQL: {e}")
        sys.exit(1)
        
    print("Checking Master Database...\n")
    if created:
        print("Database created\n")
    else:
        print("Database exists\n")
        
    engine = get_master_engine()
    
    # Create all required master tables
    Base.metadata.create_all(bind=engine)
    
    from sqlalchemy import text
    # Run manual migrations for Phase 2/3 updates to existing tables
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS performed_by INTEGER;"))
            conn.execute(text("ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS company_id INTEGER;"))
            conn.execute(text("ALTER TABLE companies ADD COLUMN IF NOT EXISTS company_logo BYTEA;"))
            conn.execute(text("ALTER TABLE companies ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT TRUE;"))
            conn.commit()
        except Exception as e:
            pass
    print("Checking Tables...\n")
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    for table_name in ["companies", "super_admin", "audit_logs"]:
        if table_name in tables:
            print(f"{table_name} [OK]\n")
        else:
            print(f"{table_name} [FAIL]\n")
            
    print("Creating Default Super Admin...\n")
    
    SessionLocal = get_master_session_local()
    db = SessionLocal()
    try:
        # Insert default Super Admin if not exists
        admin = db.query(SuperAdmin).filter(SuperAdmin.email == config.DEFAULT_SUPER_ADMIN_EMAIL).first()
        if not admin:
            new_admin = SuperAdmin(
                name=config.DEFAULT_SUPER_ADMIN_NAME,
                email=config.DEFAULT_SUPER_ADMIN_EMAIL,
                password_hash=hash_password(config.DEFAULT_SUPER_ADMIN_PASSWORD)
            )
            db.add(new_admin)
            
            # Record in audit logs
            log = AuditLog(action="Created default super admin")
            db.add(log)
            
            db.commit()
            print("Completed\n")
        else:
            print("Completed (Already exists)\n")
            
        print("Migrating existing company databases...")
        from models import Company
        from company_initializer import get_company_engine, run_company_migrations
        from company_models import CompanyBase
        
        companies = db.query(Company).all()
        for comp in companies:
            try:
                comp_engine = get_company_engine(comp.database_name)
                CompanyBase.metadata.create_all(bind=comp_engine)
                run_company_migrations(comp_engine)
            except Exception as ce:
                if "does not exist" in str(ce):
                    print(f"  -> Skipping {comp.database_name}: Database does not exist (Stale record).")
                else:
                    print(f"  -> Failed to migrate {comp.database_name}: {ce}")
                
        print("Initialization Successful")
    except Exception as e:
        db.rollback()
        print(f"Initialization Failed: {e}")
    finally:
        db.close()
