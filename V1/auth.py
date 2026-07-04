from database import get_master_session_local
from models import SuperAdmin, Company, AuditLog
from utils import check_password, hash_password
from company_initializer import get_company_engine
from sqlalchemy.orm import sessionmaker
from company_models import Employee, Security, ActivityLog

def login_super_admin(email, password):
    """Handles Super Admin login using credentials from hrms_master."""
    SessionLocal = get_master_session_local()
    db = SessionLocal()
    try:
        admin = db.query(SuperAdmin).filter(SuperAdmin.email == email).first()
        if admin and check_password(password, admin.password_hash):
            log = AuditLog(action="Super Admin Login", performed_by=admin.id)
            db.add(log)
            db.commit()
            return admin
        else:
            raise ValueError("Invalid email or password")
    finally:
        db.close()

def login_company_admin(email, password):
    """Handles Company Admin login using hrms_master."""
    SessionLocal = get_master_session_local()
    db = SessionLocal()
    try:
        company = db.query(Company).filter(Company.admin_email == email).first()
        if not company:
            raise ValueError("Invalid email or password.")
            
        if company.status == "SUSPENDED":
            raise ValueError("This company has been suspended.")
        elif company.status == "PENDING_DELETE":
            raise ValueError("This company has been marked for deletion.")
            
        if not check_password(password, company.password_hash):
            raise ValueError("Invalid email or password.")
            
        if company.must_change_password:
            # For FastAPI, we don't handle password change interactively during login.
            # We return the company and flag it.
            pass
            

            
        log = AuditLog(action="Company Admin Login", performed_by=company.company_id, company_id=company.company_id)
        db.add(log)
        db.commit()
        
        db.refresh(company)
        db.expunge(company)
        return company
    finally:
        db.close()

def login_employee_hr(company_id, email, password):
    """Handles HR and Employee login from their respective company databases."""
    SessionLocal = get_master_session_local()
    master_db = SessionLocal()
    try:
        company = master_db.query(Company).filter(Company.company_id == company_id).first()
        if not company:
            raise ValueError("Invalid Company ID.")
            
        if company.status == "SUSPENDED":
            raise ValueError("This company has been suspended.")
        elif company.status == "PENDING_DELETE":
            raise ValueError("This company has been marked for deletion.")
            
        master_db.expunge(company)
            
    finally:
        master_db.close()
        
    engine = get_company_engine(company.database_name)
    CompSession = sessionmaker(bind=engine)
    db = CompSession()
    
    try:
        emp = db.query(Employee).filter(Employee.email == email).first()
        if not emp:
            raise ValueError("Invalid email or password.")
            
        sec = db.query(Security).filter(Security.employee_id == emp.id).first()
        if not sec or not check_password(password, sec.password_hash):
            raise ValueError("Invalid email or password.")
            
        if emp.must_change_password:
            pass # Handle in API
            
        action_text = "HR Login" if emp.role == "HR" else "Employee Login"
        log = ActivityLog(action=action_text, employee_id=emp.id)
        db.add(log)
        db.commit()
        
        db.expunge(emp)
        return emp, company
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
