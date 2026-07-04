from sqlalchemy.orm import sessionmaker
from company_initializer import get_company_engine
from company_models import Department, Post, Employee, Security, ActivityLog, PersonalDetail, ProfessionalDetail, BankDetail
from database import get_master_session_local
from models import AuditLog
from utils import hash_password
from emails import send_welcome_email
import random
import string

def generate_temp_password(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))

def generate_employee_code(db, role):
    prefix = "HR" if role == "HR" else "EMP"
    count = db.query(Employee).filter(Employee.role == role).count()
    return f"{prefix}{count + 1:04d}"

# --- Department APIs ---

def create_department(db, name: str, desc: str):
    if db.query(Department).filter(Department.name == name).first():
        raise ValueError("Department name already exists.")
    new_dept = Department(name=name, description=desc)
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    log = ActivityLog(action=f"Department Created: {name}")
    db.add(log)
    db.commit()
    return new_dept

def get_departments(db):
    return db.query(Department).all()

def update_department(db, dept_id: int, name: str = None, desc: str = None, head_id: int = None):
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        raise ValueError("Department not found.")
    if name:
        if db.query(Department).filter(Department.name == name, Department.id != dept_id).first():
            raise ValueError("Name already exists.")
        dept.name = name
    if desc is not None:
        dept.description = desc
    if head_id is not None:
        dept.head_id = head_id
        
    db.commit()
    log = ActivityLog(action=f"Department Updated: {dept.name}")
    db.add(log)
    db.commit()
    db.refresh(dept)
    return dept

def delete_department(db, dept_id: int):
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        raise ValueError("Department not found.")
    db.delete(dept)
    db.commit()
    log = ActivityLog(action=f"Department Deleted: {dept.name}")
    db.add(log)
    db.commit()
    return {"success": True}

# --- Post APIs ---

def create_post(db, title: str, dept_id: int, base_sal: float):
    new_post = Post(title=title, department_id=dept_id, base_salary=base_sal)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    log = ActivityLog(action=f"Post Created: {title}")
    db.add(log)
    db.commit()
    return new_post

def get_posts(db):
    return db.query(Post).all()

def update_post(db, post_id: int, title: str = None, dept_id: int = None, base_sal: float = None):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise ValueError("Post not found.")
    if title: post.title = title
    if dept_id is not None: post.department_id = dept_id
    if base_sal is not None: post.base_salary = base_sal
    db.commit()
    db.refresh(post)
    return post

def delete_post(db, post_id: int):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise ValueError("Post not found.")
    db.delete(post)
    db.commit()
    return {"success": True}

# --- HR / Employee APIs ---

def create_hr(db, company_name: str, first_name: str, last_name: str, email: str, dept_id: int = None):
    if db.query(Employee).filter(Employee.email == email).first():
        raise ValueError("Email already exists.")
        
    emp_code = generate_employee_code(db, "HR")
    temp_pwd = generate_temp_password()
    
    new_hr = Employee(
        employee_code=emp_code,
        first_name=first_name,
        last_name=last_name,
        email=email,
        department_id=dept_id,
        role="HR",
        status="ACTIVE",
        must_change_password=True,
        profile_completed=False
    )
    db.add(new_hr)
    db.flush()
    
    sec = Security(employee_id=new_hr.id, password_hash=hash_password(temp_pwd))
    db.add(sec)
    db.add(PersonalDetail(employee_id=new_hr.id))
    db.add(ProfessionalDetail(employee_id=new_hr.id))
    db.add(BankDetail(employee_id=new_hr.id))
    
    log = ActivityLog(action=f"HR Created: {emp_code}", employee_id=new_hr.id)
    db.add(log)
    db.commit()
    db.refresh(new_hr)
    
    send_welcome_email(email, emp_code, temp_pwd, company_name, "HR")
    return new_hr

def get_hrs(db):
    return db.query(Employee).filter(Employee.role == "HR").all()

def update_hr(db, hr_id: int, dept_id: int = None):
    hr = db.query(Employee).filter(Employee.id == hr_id, Employee.role == "HR").first()
    if not hr:
        raise ValueError("HR not found.")
    if dept_id is not None:
        hr.department_id = dept_id
    db.commit()
    db.refresh(hr)
    return hr

def create_employee(db, company_name: str, first_name: str, last_name: str, email: str, off_phone: str = None, dept_id: int = None, post_id: int = None, hr_id: int = None):
    if db.query(Employee).filter(Employee.email == email).first():
        raise ValueError("Email already exists.")
        
    emp_code = generate_employee_code(db, "EMPLOYEE")
    temp_pwd = generate_temp_password()
    
    new_emp = Employee(
        employee_code=emp_code,
        first_name=first_name,
        last_name=last_name,
        email=email,
        official_phone=off_phone,
        department_id=dept_id,
        post_id=post_id,
        reporting_hr_id=hr_id,
        role="EMPLOYEE",
        status="ACTIVE",
        must_change_password=True,
        profile_completed=False
    )
    db.add(new_emp)
    db.flush()
    
    sec = Security(employee_id=new_emp.id, password_hash=hash_password(temp_pwd))
    db.add(sec)
    db.add(PersonalDetail(employee_id=new_emp.id))
    db.add(ProfessionalDetail(employee_id=new_emp.id))
    db.add(BankDetail(employee_id=new_emp.id))
    
    log = ActivityLog(action=f"Employee Created: {emp_code}", employee_id=new_emp.id)
    db.add(log)
    db.commit()
    db.refresh(new_emp)
    
    send_welcome_email(email, emp_code, temp_pwd, company_name, "EMPLOYEE")
    return new_emp

def get_employees(db):
    return db.query(Employee).filter(Employee.role == "EMPLOYEE").all()

def toggle_employee_status(db, emp_id: int, role: str):
    emp = db.query(Employee).filter(Employee.id == emp_id, Employee.role == role).first()
    if not emp:
        raise ValueError("Employee not found.")
    emp.status = "SUSPENDED" if emp.status == "ACTIVE" else "ACTIVE"
    log = ActivityLog(action=f"Employee {'Suspended' if emp.status=='SUSPENDED' else 'Activated'}", employee_id=emp.id)
    db.add(log)
    db.commit()
    db.refresh(emp)
    return emp

def get_activity_logs(db):
    return db.query(ActivityLog).all()
