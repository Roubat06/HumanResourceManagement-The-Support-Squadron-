import sys
import datetime
import random
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from database import get_master_engine, get_master_session_local
from company_initializer import get_company_engine
from models import SuperAdmin, Company, AuditLog
from company_models import Department, Post, Employee, Security, PersonalDetail, ProfessionalDetail, BankDetail, ActivityLog
from utils import hash_password
from master_initializer import initialize

def generate_dummy_data():
    master_db = get_master_session_local()()
    try:
        # Create companies
        companies_data = [
            ("ABC Pvt Ltd", "admin@abc.com"),
            ("XYZ Technologies", "admin@xyz.com")
        ]
        
        for name, email in companies_data:
            existing = master_db.query(Company).filter(Company.company_email == email).first()
            if not existing:
                print(f"Creating dummy company: {name}")
                # Simulate company registration
                db_name = f"hrms_company_{random.randint(1000, 9999)}"
                new_company = Company(
                    company_name=name,
                    company_email=email,
                    company_phone="1234567890",
                    admin_name="Admin " + name.split()[0],
                    admin_email="admin@" + name.replace(" ", "").lower() + ".com",
                    password_hash=hash_password("admin123"),
                    database_name=db_name,
                    status="ACTIVE"
                )
                master_db.add(new_company)
                master_db.commit()
                
                # Init company db
                from company_initializer import initialize_company
                initialize_company(db_name, new_company.admin_name, new_company.admin_email, new_company.password_hash)
        
        companies = master_db.query(Company).all()
        for company in companies:
            engine = get_company_engine(company.database_name)
            CompSession = sessionmaker(bind=engine)
            db = CompSession()
            try:
                # Add Departments
                depts = ["HR", "Development", "Accounts"]
                for d in depts:
                    if not db.query(Department).filter(Department.name == d).first():
                        db.add(Department(name=d, description=f"{d} Department"))
                db.commit()
                
                # Add Posts
                posts = ["HR Manager", "Software Engineer", "Accountant", "Team Lead"]
                for p in posts:
                    if not db.query(Post).filter(Post.title == p).first():
                        # Assign random dept
                        dept = db.query(Department).order_by(Department.id).first()
                        db.add(Post(title=p, department_id=dept.id, base_salary=50000))
                db.commit()
                
                # We need HR and Employees but for tests we can just rely on the tests to create them.
            except Exception as e:
                print(f"Error seeding {company.company_name}: {e}")
            finally:
                db.close()
                
    finally:
        master_db.close()
    print("Dummy data generation complete.")

def run_tests():
    print("\n==================================")
    print("HRMS AUTOMATED QA TESTS")
    print("==================================")
    
    score = 0
    total = 11
    
    def report(name, status):
        nonlocal score
        if status: score += 1
        print(f"{name:.<40} {'PASS' if status else 'FAIL'}")

    # 1. Master Database
    try:
        engine = get_master_engine()
        engine.connect().close()
        report("Master Database", True)
    except:
        report("Master Database", False)

    # 2. Company Registration (Duplicate check)
    try:
        master_db = get_master_session_local()()
        comp = Company(company_name="Test", company_email="test@test.com", admin_name="Admin", admin_email="test@test.com", password_hash="hash", database_name="test_db")
        master_db.add(comp)
        master_db.commit()
        
        # Try duplicate email
        comp2 = Company(company_name="Test2", company_email="test@test.com", admin_name="Admin2", admin_email="test2@test.com", password_hash="hash", database_name="test_db2")
        master_db.add(comp2)
        try:
            master_db.commit()
            report("Company Registration (Duplicate check)", False)
        except IntegrityError:
            master_db.rollback()
            report("Company Registration", True)
    except Exception as e:
        report("Company Registration", False)
    finally:
        master_db.close()
        
    # We will output a summary to be captured.
    print(f"\nOverall Score: {score} / {total}")
    
if __name__ == "__main__":
    initialize()
    generate_dummy_data()
    run_tests()
