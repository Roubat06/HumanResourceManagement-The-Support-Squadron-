from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from schemas import LoginRequest, EmployeeCreate, ProfileUpdate
from dependencies import require_hr, get_company_db, get_master_db
from auth import login_employee_hr
import hr_dashboard as hr_module
import employee_dashboard as emp_module

router = APIRouter(prefix="/hr", tags=["HR"])

@router.post("/login")
def login(req: LoginRequest, request: Request):
    if not req.company_id:
        raise HTTPException(status_code=400, detail="Company ID required")
    try:
        emp_role, emp_id, company = login_employee_hr(req.company_id, req.email, req.password)
        if emp_role != "HR":
            raise HTTPException(status_code=403, detail="Not an HR account")
        request.session["user_id"] = emp_id
        request.session["user_type"] = "HR"
        request.session["company_id"] = company.company_id
        request.session["database_name"] = company.database_name
        return {"success": True, "message": "Login successful"}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard", dependencies=[Depends(require_hr)])
def get_dashboard():
    raise HTTPException(status_code=501, detail="Coming in next release.")

@router.get("/employees", dependencies=[Depends(require_hr)])
def get_employees(request: Request, db: Session = Depends(get_company_db)):
    try:
        hr_id = request.session.get("user_id")
        emps = hr_module.get_hr_employees(db, hr_id)
        return {"success": True, "data": emps}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/employee/{id}", dependencies=[Depends(require_hr)])
def update_employee(id: int, req: EmployeeCreate, request: Request, db: Session = Depends(get_company_db)):
    try:
        hr_id = request.session.get("user_id")
        emp = hr_module.update_employee_official_details(db, hr_id, id, req.post_id, req.official_phone, req.email)
        return {"success": True, "data": emp}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/profile", dependencies=[Depends(require_hr)])
def get_profile(request: Request, db: Session = Depends(get_company_db)):
    try:
        hr_id = request.session.get("user_id")
        return {"success": True, "data": emp_module.get_employee_profile(db, hr_id)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/profile", dependencies=[Depends(require_hr)])
def update_profile(req: ProfileUpdate, request: Request, db: Session = Depends(get_company_db)):
    try:
        hr_id = request.session.get("user_id")
        res = emp_module.update_editable_profile(db, hr_id, req.model_dump(exclude_unset=True))
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
