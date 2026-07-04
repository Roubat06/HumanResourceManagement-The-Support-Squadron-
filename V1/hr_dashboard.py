from sqlalchemy.orm import sessionmaker
from company_initializer import get_company_engine
from company_models import Employee, ActivityLog

def get_hr_employees(db, hr_id: int):
    hr = db.query(Employee).filter(Employee.id == hr_id).first()
    if not hr:
        raise ValueError("HR not found")
        
    emps = db.query(Employee).filter(
        (Employee.department_id == hr.department_id) |
        (Employee.reporting_hr_id == hr.id)
    ).filter(Employee.role == "EMPLOYEE").all()
    return emps

def update_employee_official_details(db, hr_id: int, emp_id: int, post_id: int = None, official_phone: str = None, email: str = None):
    hr = db.query(Employee).filter(Employee.id == hr_id).first()
    if not hr:
        raise ValueError("HR not found")
        
    emp = db.query(Employee).filter(
        Employee.id == emp_id, 
        Employee.role == "EMPLOYEE",
        ((Employee.department_id == hr.department_id) | (Employee.reporting_hr_id == hr.id))
    ).first()
    if not emp:
        raise ValueError("Employee not found or not assigned to you.")
        
    if post_id is not None: emp.post_id = post_id
    if official_phone is not None: emp.official_phone = official_phone
    if email is not None: emp.email = email
    
    log = ActivityLog(action=f"Edited Employee Official Details: {emp.employee_code}", employee_id=hr.id)
    db.add(log)
    db.commit()
    db.refresh(emp)
    return emp

def get_hr_profile(db, hr_id: int):
    hr = db.query(Employee).filter(Employee.id == hr_id, Employee.role == "HR").first()
    if not hr:
        raise ValueError("HR not found")
    return hr
