from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    company_id: Optional[int] = None

class CompanyRegisterRequest(BaseModel):
    company_name: str
    company_email: EmailStr
    company_phone: str
    admin_name: str
    admin_email: EmailStr
    admin_phone: str
    admin_password: str

class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = None

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    head_id: Optional[int] = None

class PostCreate(BaseModel):
    title: str
    department_id: int
    base_salary: float = 0.0

class PostUpdate(BaseModel):
    title: Optional[str] = None
    department_id: Optional[int] = None
    base_salary: Optional[float] = None

class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    department_id: Optional[int] = None
    post_id: Optional[int] = None
    reporting_hr_id: Optional[int] = None
    official_phone: Optional[str] = None

class HRCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    department_id: Optional[int] = None

class PasswordChangeRequest(BaseModel):
    new_password: str

class ProfileUpdate(BaseModel):
    gender: Optional[str] = None
    emergency_contact: Optional[str] = None
    personal_email: Optional[EmailStr] = None
    nationality: Optional[str] = None
    marital_status: Optional[str] = None
    blood_group: Optional[str] = None
    skills: Optional[str] = None
    about: Optional[str] = None
    pan: Optional[str] = None
    uan: Optional[str] = None
