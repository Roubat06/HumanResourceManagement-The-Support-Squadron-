from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from schemas import LoginRequest, DepartmentCreate, DepartmentUpdate, PostCreate, PostUpdate, HRCreate, EmployeeCreate
from dependencies import require_company_admin, get_company_db, get_master_db
from auth import login_company_admin
import company_admin as ca_module
from models import Company

router = APIRouter(prefix="/company-admin", tags=["Company Admin"])
company_router = APIRouter(prefix="", tags=["Company Admin"]) # For routes starting with /department, /post, etc. but still under Company Admin logic.
# Wait, the user asked for:
# POST /company-admin/login
# GET /company/profile
# POST /department
# GET /departments
# ...

@router.post("/login")
def login(req: LoginRequest, request: Request):
    try:
        company = login_company_admin(req.email, req.password)
        request.session["user_id"] = company.company_id
        request.session["user_type"] = "COMPANY_ADMIN"
        request.session["company_id"] = company.company_id
        request.session["database_name"] = company.database_name
        return {"success": True, "message": "Login successful"}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

@company_router.get("/company/profile", dependencies=[Depends(require_company_admin)])
def get_company_profile(request: Request, db: Session = Depends(get_master_db)):
    company_id = request.session.get("company_id")
    company = db.query(Company).filter(Company.company_id == company_id).first()
    return {"success": True, "data": company}

@company_router.put("/company/profile", dependencies=[Depends(require_company_admin)])
def update_company_profile():
    raise HTTPException(status_code=501, detail="Coming in next release.")

# --- Departments ---

@company_router.post("/department", dependencies=[Depends(require_company_admin)])
def create_department(req: DepartmentCreate, db: Session = Depends(get_company_db)):
    try:
        dept = ca_module.create_department(db, req.name, req.description)
        return {"success": True, "data": dept}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@company_router.get("/departments", dependencies=[Depends(require_company_admin)])
def get_departments(db: Session = Depends(get_company_db)):
    depts = ca_module.get_departments(db)
    return {"success": True, "data": depts}

@company_router.put("/department/{id}", dependencies=[Depends(require_company_admin)])
def update_department(id: int, req: DepartmentUpdate, db: Session = Depends(get_company_db)):
    try:
        dept = ca_module.update_department(db, id, req.name, req.description, req.head_id)
        return {"success": True, "data": dept}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@company_router.delete("/department/{id}", dependencies=[Depends(require_company_admin)])
def delete_department(id: int, db: Session = Depends(get_company_db)):
    try:
        res = ca_module.delete_department(db, id)
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Posts ---

@company_router.post("/post", dependencies=[Depends(require_company_admin)])
def create_post(req: PostCreate, db: Session = Depends(get_company_db)):
    try:
        post = ca_module.create_post(db, req.title, req.department_id, req.base_salary)
        return {"success": True, "data": post}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@company_router.get("/posts", dependencies=[Depends(require_company_admin)])
def get_posts(db: Session = Depends(get_company_db)):
    return {"success": True, "data": ca_module.get_posts(db)}

@company_router.put("/post/{id}", dependencies=[Depends(require_company_admin)])
def update_post(id: int, req: PostUpdate, db: Session = Depends(get_company_db)):
    try:
        post = ca_module.update_post(db, id, req.title, req.department_id, req.base_salary)
        return {"success": True, "data": post}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@company_router.delete("/post/{id}", dependencies=[Depends(require_company_admin)])
def delete_post(id: int, db: Session = Depends(get_company_db)):
    try:
        return ca_module.delete_post(db, id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- HR ---

@company_router.post("/hr", dependencies=[Depends(require_company_admin)])
def create_hr(req: HRCreate, request: Request, db: Session = Depends(get_company_db), m_db: Session = Depends(get_master_db)):
    company = m_db.query(Company).filter(Company.company_id == request.session["company_id"]).first()
    try:
        hr = ca_module.create_hr(db, company.company_name, req.first_name, req.last_name, req.email, req.department_id)
        return {"success": True, "data": hr}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@company_router.get("/hr", dependencies=[Depends(require_company_admin)])
def get_hrs(db: Session = Depends(get_company_db)):
    return {"success": True, "data": ca_module.get_hrs(db)}

@company_router.put("/hr/{id}", dependencies=[Depends(require_company_admin)])
def update_hr(id: int, req: HRCreate, db: Session = Depends(get_company_db)):
    try:
        hr = ca_module.update_hr(db, id, req.department_id)
        return {"success": True, "data": hr}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@company_router.delete("/hr/{id}", dependencies=[Depends(require_company_admin)])
def toggle_hr(id: int, db: Session = Depends(get_company_db)):
    try:
        hr = ca_module.toggle_employee_status(db, id, "HR")
        return {"success": True, "status": hr.status}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Employees ---

@company_router.post("/employee", dependencies=[Depends(require_company_admin)])
def create_employee(req: EmployeeCreate, request: Request, db: Session = Depends(get_company_db), m_db: Session = Depends(get_master_db)):
    company = m_db.query(Company).filter(Company.company_id == request.session["company_id"]).first()
    try:
        emp = ca_module.create_employee(db, company.company_name, req.first_name, req.last_name, req.email, req.official_phone, req.department_id, req.post_id, req.reporting_hr_id)
        return {"success": True, "data": emp}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@company_router.get("/employees", dependencies=[Depends(require_company_admin)])
def get_employees(db: Session = Depends(get_company_db)):
    return {"success": True, "data": ca_module.get_employees(db)}

@company_router.put("/employee/{id}", dependencies=[Depends(require_company_admin)])
def update_employee(id: int):
    raise HTTPException(status_code=501, detail="Coming in next release.")

@company_router.delete("/employee/{id}", dependencies=[Depends(require_company_admin)])
def toggle_employee(id: int, db: Session = Depends(get_company_db)):
    try:
        emp = ca_module.toggle_employee_status(db, id, "EMPLOYEE")
        return {"success": True, "status": emp.status}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
