import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, LargeBinary, Boolean
from sqlalchemy.orm import declarative_base

Base = declarative_base()

def get_utc_now():
    return datetime.datetime.now(datetime.timezone.utc)

class Company(Base):
    __tablename__ = "companies"

    company_id = Column(Integer, primary_key=True, autoincrement=True)
    company_name = Column(String(255), nullable=False)
    company_email = Column(String(255), unique=True, nullable=False)
    company_phone = Column(String(50))
    admin_name = Column(String(255), nullable=False)
    admin_email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    database_name = Column(String(255), unique=True, nullable=False)
    company_logo = Column(LargeBinary)
    status = Column(String(50), default="ACTIVE")
    must_change_password = Column(Boolean, default=True)
    created_at = Column(DateTime, default=get_utc_now)


class SuperAdmin(Base):
    __tablename__ = "super_admin"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=get_utc_now)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    action = Column(Text, nullable=False)
    performed_by = Column(Integer, nullable=True)
    company_id = Column(Integer, nullable=True)
    timestamp = Column(DateTime, default=get_utc_now)
