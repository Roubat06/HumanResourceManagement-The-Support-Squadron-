from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from schemas import LoginRequest, CompanyRegisterRequest
from dependencies import get_master_db, require_super_admin
import super_admin as sa_module
from auth import login_super_admin
from models import AuditLog, Company

router = APIRouter(prefix="/superadmin", tags=["Super Admin"])

@router.post("/login")
def login(req: LoginRequest, request: Request):
    try:
        admin = login_super_admin(req.email, req.password)
        request.session["user_id"] = admin.id
        request.session["user_type"] = "SUPER_ADMIN"
        return {"success": True, "message": "Login successful"}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/company/register", dependencies=[Depends(require_super_admin)])
def register_company(req: CompanyRegisterRequest, request: Request):
    try:
        admin_id = request.session.get("user_id")
        comp = sa_module.register_company(
            admin_id=admin_id,
            company_name=req.company_name,
            company_email=req.company_email,
            company_phone=req.company_phone,
            admin_name=req.admin_name,
            admin_email=req.admin_email,
            admin_phone=req.admin_phone,
            admin_password=req.admin_password
        )
        return {"success": True, "company_id": comp.company_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/company/list", dependencies=[Depends(require_super_admin)])
def list_companies():
    companies = sa_module.get_companies()
    return {"success": True, "data": companies}

@router.put("/company/suspend/{company_id}", dependencies=[Depends(require_super_admin)])
def suspend_company(company_id: int, request: Request):
    try:
        admin_id = request.session.get("user_id")
        res = sa_module.toggle_company_status(admin_id, company_id, "suspend")
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/company/activate/{company_id}", dependencies=[Depends(require_super_admin)])
def activate_company(company_id: int, request: Request):
    try:
        admin_id = request.session.get("user_id")
        res = sa_module.toggle_company_status(admin_id, company_id, "activate")
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/company/delete/{company_id}", dependencies=[Depends(require_super_admin)])
def delete_company(company_id: int, request: Request):
    try:
        admin_id = request.session.get("user_id")
        res = sa_module.delete_company(admin_id, company_id)
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/audit/logs", dependencies=[Depends(require_super_admin)])
def get_audit_logs(db: Session = Depends(get_master_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()
    return {"success": True, "data": logs}
