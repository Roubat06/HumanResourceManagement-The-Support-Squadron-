from database import get_master_session_local
from models import Company, AuditLog
from company_initializer import initialize_company
from utils import hash_password

def super_admin_dashboard(admin_id: int):
    while True:
        print("\n=================================")
        print("SUPER ADMIN")
        print("=================================")
        print("1. Register Company")
        print("2. View Companies")
        print("3. Activate / Suspend Company")
        print("4. Delete Company")
        print("5. Logout")
        
        choice = input("Enter choice: ").strip()
        
        if choice == '1':
            register_company(admin_id)
        elif choice == '2':
            view_companies()
        elif choice == '3':
            toggle_company_status(admin_id)
        elif choice == '4':
            delete_company(admin_id)
        elif choice == '5':
            SessionLocal = get_master_session_local()
            db = SessionLocal()
            try:
                log = AuditLog(action="Super Admin Logout", performed_by=admin_id)
                db.add(log)
                db.commit()
            except:
                pass
            finally:
                db.close()
            print("Logging out...")
            break
        else:
            print("Invalid choice, please try again.")

def register_company(admin_id: int, company_name: str, company_email: str, company_phone: str, admin_name: str, admin_email: str, admin_phone: str, admin_password: str, company_logo_data: bytes = None):
    from emails import send_registration_success_email
    if not (company_name and company_email and admin_name and admin_email and admin_password):
        raise ValueError("Missing required fields.")

            
    SessionLocal = get_master_session_local()
    db = SessionLocal()
    try:
        # Generate database name
        count = db.query(Company).count() + 1
        db_name = f"hrms_company_{count:04d}"
        
        # Ensure unique database name
        while db.query(Company).filter(Company.database_name == db_name).first():
            count += 1
            db_name = f"hrms_company_{count:04d}"
            
        hashed_pw = hash_password(admin_password)
        
        new_company = Company(
            company_name=company_name,
            company_email=company_email,
            company_phone=company_phone,
            admin_name=admin_name,
            admin_email=admin_email,
            password_hash=hashed_pw,
            database_name=db_name,
            company_logo=company_logo_data,
            status="ACTIVE"
        )
        db.add(new_company)
        db.commit()
        db.refresh(new_company)

        
        # Call the company initializer to create DB and insert Company Admin
        initialize_company(db_name, admin_name, admin_email, hashed_pw)
        
        # Add audit log
        log = AuditLog(action="Company Registered", performed_by=admin_id, company_id=new_company.company_id)
        db.add(log)
        db.commit()
        
        send_registration_success_email(
            admin_email, company_name, new_company.company_id, db_name, admin_email, admin_password
        )
        return new_company
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def get_companies():
    SessionLocal = get_master_session_local()
    db = SessionLocal()
    try:
        companies = db.query(Company).all()
        return companies
            
    finally:
        db.close()

def toggle_company_status(admin_id: int, company_id: int, action: str):
    from emails import send_company_suspended_email, send_company_activated_email
    SessionLocal = get_master_session_local()
    db = SessionLocal()
    try:
        company = db.query(Company).filter(Company.company_id == company_id).first()
        if not company:
            raise ValueError("Company not found.")
            
        new_status = "SUSPENDED" if action == "suspend" else "ACTIVE"
        company.status = new_status
        if new_status == "SUSPENDED":
            log = AuditLog(action="Company Suspended", performed_by=admin_id, company_id=company_id)
            send_company_suspended_email(company.admin_email)
        else:
            log = AuditLog(action="Company Activated", performed_by=admin_id, company_id=company_id)
            send_company_activated_email(company.admin_email)
        db.add(log)
        db.commit()
        return {"success": True, "new_status": new_status}
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def delete_company(admin_id: int, company_id: int):
    from emails import send_deletion_warning_email
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    import config
    
    SessionLocal = get_master_session_local()
    db = SessionLocal()
    try:
        company = db.query(Company).filter(Company.company_id == company_id).first()
        if not company:
            raise ValueError("Company not found.")
            
        if company.status == "ACTIVE":
            raise ValueError("Company must be suspended before permanent deletion.")
            
        company.status = "PENDING_DELETE"
        log = AuditLog(action="Company Marked for Deletion", performed_by=admin_id, company_id=company_id)
        db.add(log)
        db.commit()
        
        send_deletion_warning_email(company.admin_email)
        
        db_name = company.database_name
        
        # Drop database using raw psycopg2 connection
        conn = psycopg2.connect(
            dbname="postgres",
            user=config.DB_USER,
            password=config.DB_PASSWORD,
            host=config.DB_HOST,
            port=config.DB_PORT
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Disconnect all active users before dropping (optional but recommended in real life)
        cursor.execute(f"SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '{db_name}' AND pid <> pg_backend_pid();")
        
        cursor.execute(f"DROP DATABASE IF EXISTS {db_name}")
        cursor.close()
        conn.close()
        
        db.delete(company)
        
        log = AuditLog(action="Company Deleted", performed_by=admin_id, company_id=company_id)
        db.add(log)
        db.commit()
        
        return {"success": True, "message": "Company deleted successfully."}
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
