import random
from database import get_master_session_local
from models import Company, AuditLog
from company_initializer import initialize_company
from utils import hash_password
from emails import send_otp_email, send_registration_success_email

def public_register_company():
    print("\n--- Register New Company ---")
    company_name = input("Company Name: ").strip()
    company_email = input("Company Email: ").strip()
    company_phone = input("Company Phone: ").strip()
    admin_name = input("Admin Name: ").strip()
    admin_email = input("Admin Email: ").strip()
    admin_phone = input("Admin Phone: ").strip()
    admin_password = input("Password: ").strip()
    company_logo_path = input("Company Logo File Path (optional): ").strip()
    
    if not (company_name and company_email and admin_name and admin_email and admin_password):
        print("Error: Missing required fields.")
        return
        
    company_logo_data = None
    if company_logo_path:
        try:
            with open(company_logo_path, 'rb') as f:
                company_logo_data = f.read()
        except Exception as e:
            print(f"Could not read logo image: {e}")
            
    # Generate OTP
    otp = str(random.randint(100000, 999999))
    print(f"\nSending OTP to {admin_email}...")
    
    # Send email
    email_sent = send_otp_email(admin_email, otp)
    if not email_sent:
        print("Failed to send OTP. Registration stopped.")
        return
        
    entered_otp = input("Enter OTP sent to your email: ").strip()
    if entered_otp != otp:
        print("Invalid OTP. Registration stopped.")
        return
        
    print("OTP Verified Successfully.")
    
    SessionLocal = get_master_session_local()
    db = SessionLocal()
    try:
        # Generate database name
        count = db.query(Company).count() + 1
        db_name = f"hrms_company_{count:04d}"
        
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
        
        print(f"\nCreated Company Record ID: {new_company.company_id}")
        print(f"Creating database {db_name} and tables...")
        
        initialize_company(db_name, admin_name, admin_email, hashed_pw)
        
        log = AuditLog(action="Company Registered", company_id=new_company.company_id)
        db.add(log)
        db.commit()
        
        print("Company successfully registered and database initialized!")
        
        send_registration_success_email(
            admin_email, company_name, new_company.company_id, db_name, admin_email, admin_password
        )
        print("Registration success email sent.")
        
    except Exception as e:
        db.rollback()
        print(f"Error registering company: {e}")
    finally:
        db.close()
