from fastapi import Request, HTTPException, Depends
from typing import Optional
from database import get_master_session_local
from company_initializer import get_company_engine
from sqlalchemy.orm import sessionmaker

def get_master_db():
    db = get_master_session_local()()
    try:
        yield db
    finally:
        db.close()

def get_current_user_session(request: Request):
    user_id = request.session.get("user_id")
    user_type = request.session.get("user_type")
    
    if not user_id or not user_type:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    return {
        "user_id": user_id,
        "user_type": user_type,
        "company_id": request.session.get("company_id")
    }

def require_super_admin(session_data: dict = Depends(get_current_user_session)):
    if session_data["user_type"] != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Super Admin privileges required")
    return session_data

def require_company_admin(session_data: dict = Depends(get_current_user_session)):
    if session_data["user_type"] != "COMPANY_ADMIN":
        raise HTTPException(status_code=403, detail="Company Admin privileges required")
    return session_data

def require_hr(session_data: dict = Depends(get_current_user_session)):
    if session_data["user_type"] != "HR":
        raise HTTPException(status_code=403, detail="HR privileges required")
    return session_data

def require_employee(session_data: dict = Depends(get_current_user_session)):
    if session_data["user_type"] not in ["EMPLOYEE", "HR"]:
        raise HTTPException(status_code=403, detail="Employee privileges required")
    return session_data

def get_company_db(request: Request):
    company_id = request.session.get("company_id")
    db_name = request.session.get("database_name")
    
    if not company_id or not db_name:
        raise HTTPException(status_code=401, detail="Company context not found in session")
        
    engine = get_company_engine(db_name)
    CompSession = sessionmaker(bind=engine)
    db = CompSession()
    try:
        yield db
    finally:
        db.close()
