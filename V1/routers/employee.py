from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from schemas import LoginRequest, ProfileUpdate
from dependencies import require_employee, get_company_db, get_master_db
from auth import login_employee_hr
import employee_dashboard as emp_module

router = APIRouter(prefix="/employee", tags=["Employee"])

@router.post("/login")
def login(req: LoginRequest, request: Request):
    if not req.company_id:
        raise HTTPException(status_code=400, detail="Company ID required")
    try:
        emp, company = login_employee_hr(req.company_id, req.email, req.password)
        request.session["user_id"] = emp.id
        request.session["user_type"] = emp.role # EMPLOYEE
        request.session["company_id"] = company.company_id
        request.session["database_name"] = company.database_name
        return {"success": True, "message": "Login successful"}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/change-password", dependencies=[Depends(require_employee)])
def change_password():
    raise HTTPException(status_code=501, detail="Coming in next release.")

@router.post("/complete-profile", dependencies=[Depends(require_employee)])
def complete_profile(req: ProfileUpdate, request: Request, db: Session = Depends(get_company_db)):
    try:
        emp_id = request.session.get("user_id")
        res = emp_module.complete_employee_profile(db, emp_id, req.model_dump(exclude_unset=True))
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/profile", dependencies=[Depends(require_employee)])
def get_profile(request: Request, db: Session = Depends(get_company_db)):
    try:
        emp_id = request.session.get("user_id")
        return {"success": True, "data": emp_module.get_employee_profile(db, emp_id)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/profile", dependencies=[Depends(require_employee)])
def update_profile(req: ProfileUpdate, request: Request, db: Session = Depends(get_company_db)):
    try:
        emp_id = request.session.get("user_id")
        res = emp_module.update_editable_profile(db, emp_id, req.model_dump(exclude_unset=True))
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/dashboard", dependencies=[Depends(require_employee)])
def get_dashboard():
    raise HTTPException(status_code=501, detail="Coming in next release.")

from fastapi import Response
from company_models import Employee

@router.get("/photo/{employee_id}")
def get_employee_photo(employee_id: int, request: Request, db: Session = Depends(get_company_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp or not emp.profile_photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    return Response(content=emp.profile_photo, media_type="image/jpeg")
