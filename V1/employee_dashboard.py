from sqlalchemy.orm import sessionmaker
from company_initializer import get_company_engine
from company_models import Employee, ActivityLog, PersonalDetail, ProfessionalDetail, BankDetail
from datetime import datetime

def get_employee_profile(db, emp_id: int):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise ValueError("Employee not found")
        
    personal = db.query(PersonalDetail).filter(PersonalDetail.employee_id == emp.id).first()
    professional = db.query(ProfessionalDetail).filter(ProfessionalDetail.employee_id == emp.id).first()
    bank = db.query(BankDetail).filter(BankDetail.employee_id == emp.id).first()
    
    return {
        "employee": emp,
        "personal": personal,
        "professional": professional,
        "bank": bank
    }

def complete_employee_profile(db, emp_id: int, profile_data: dict):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise ValueError("Employee not found")
        
    personal = db.query(PersonalDetail).filter(PersonalDetail.employee_id == emp.id).first()
    professional = db.query(ProfessionalDetail).filter(ProfessionalDetail.employee_id == emp.id).first()
    bank = db.query(BankDetail).filter(BankDetail.employee_id == emp.id).first()
    
    if not personal:
        personal = PersonalDetail(employee_id=emp.id)
        db.add(personal)
    if not professional:
        professional = ProfessionalDetail(employee_id=emp.id)
        db.add(professional)
    if not bank:
        bank = BankDetail(employee_id=emp.id)
        db.add(bank)
        
    # Update personal
    if 'dob' in profile_data and profile_data['dob']:
        try:
            personal.dob = datetime.strptime(profile_data['dob'], "%Y-%m-%d").date()
        except:
            pass
    for field in ['gender', 'address', 'emergency_contact', 'personal_email', 'nationality', 'marital_status', 'blood_group']:
        if field in profile_data:
            setattr(personal, field, profile_data[field])
            
    # Update professional
    if 'skills' in profile_data: professional.skills = profile_data['skills']
    if 'experience_years' in profile_data: professional.experience_years = profile_data['experience_years']
    if 'about' in profile_data: professional.about = profile_data['about']
    if 'pan' in profile_data: professional.pan = profile_data['pan']
    if 'uan' in profile_data: professional.uan = profile_data['uan']
    
    # Update bank
    if 'bank_name' in profile_data: bank.bank_name = profile_data['bank_name']
    if 'account_number' in profile_data: bank.account_number = profile_data['account_number']
    if 'ifsc_code' in profile_data: bank.ifsc_code = profile_data['ifsc_code']
    
    emp.profile_completed = True
    
    log = ActivityLog(action="Profile Completed", employee_id=emp.id)
    db.add(log)
    db.commit()
    return {"success": True}

def update_editable_profile(db, emp_id: int, update_data: dict):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise ValueError("Employee not found")
        
    personal = db.query(PersonalDetail).filter(PersonalDetail.employee_id == emp.id).first()
    professional = db.query(ProfessionalDetail).filter(ProfessionalDetail.employee_id == emp.id).first()
    
    if 'address' in update_data and update_data['address'] is not None:
        personal.address = update_data['address']
    if 'emergency_contact' in update_data and update_data['emergency_contact'] is not None:
        personal.emergency_contact = update_data['emergency_contact']
    if 'personal_email' in update_data and update_data['personal_email'] is not None:
        personal.personal_email = update_data['personal_email']
    if 'skills' in update_data and update_data['skills'] is not None:
        professional.skills = update_data['skills']
    if 'about' in update_data and update_data['about'] is not None:
        professional.about = update_data['about']
        
    log = ActivityLog(action="Edited Profile Fields", employee_id=emp.id)
    db.add(log)
    db.commit()
    return {"success": True}
