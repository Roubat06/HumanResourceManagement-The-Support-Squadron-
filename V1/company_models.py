import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Date, Numeric, Boolean, LargeBinary
from sqlalchemy.orm import declarative_base

CompanyBase = declarative_base()

def get_utc_now():
    return datetime.datetime.now(datetime.timezone.utc)

class Department(CompanyBase):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    head_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

class Post(CompanyBase):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    base_salary = Column(Numeric(10, 2), default=0)
    increment = Column(Numeric(10, 2), default=0)
    hra = Column(Numeric(10, 2), default=0)
    allowance = Column(Numeric(10, 2), default=0)
    pf = Column(Numeric(10, 2), default=0)
    professional_tax = Column(Numeric(10, 2), default=0)
    created_at = Column(DateTime, default=get_utc_now)

class Employee(CompanyBase):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_code = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    official_phone = Column(String(50))
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=True)
    reporting_hr_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    role = Column(String(50), default="EMPLOYEE")
    status = Column(String(50), default="ACTIVE")
    profile_photo = Column(LargeBinary, nullable=True)
    must_change_password = Column(Boolean, default=True)
    profile_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=get_utc_now)

class PersonalDetail(CompanyBase):
    __tablename__ = "personal_details"
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), unique=True)
    dob = Column(Date)
    gender = Column(String(50))
    address = Column(Text)
    phone = Column(String(50))
    emergency_contact = Column(String(255))
    personal_email = Column(String(255))
    nationality = Column(String(100))
    marital_status = Column(String(50))
    blood_group = Column(String(10))

class ProfessionalDetail(CompanyBase):
    __tablename__ = "professional_details"
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), unique=True)
    date_of_joining = Column(Date)
    experience_years = Column(Integer)
    skills = Column(Text)
    about = Column(Text)
    pan = Column(String(50))
    uan = Column(String(50))

class BankDetail(CompanyBase):
    __tablename__ = "bank_details"
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), unique=True)
    account_number = Column(String(100))
    ifsc_code = Column(String(50))
    bank_name = Column(String(255))

class Attendance(CompanyBase):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    date = Column(Date, nullable=False)
    status = Column(String(50))
    punch_in = Column(DateTime)
    punch_out = Column(DateTime)

class LeaveBalance(CompanyBase):
    __tablename__ = "leave_balance"
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    leave_type = Column(String(50))
    balance = Column(Integer, default=0)

class LeaveRequest(CompanyBase):
    __tablename__ = "leave_requests"
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(Text)
    status = Column(String(50), default="PENDING")

class Payroll(CompanyBase):
    __tablename__ = "payroll"
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    month = Column(Integer)
    year = Column(Integer)
    basic_salary = Column(Numeric(10, 2))
    net_salary = Column(Numeric(10, 2))

class Security(CompanyBase):
    __tablename__ = "security"
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), unique=True)
    password_hash = Column(String(255), nullable=False)
    is_locked = Column(Boolean, default=False)

class ActivityLog(CompanyBase):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    action = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=get_utc_now)
