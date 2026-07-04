import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import config

def send_email(to_email: str, subject: str, body: str):
    """Utility to send emails using smtplib."""
    try:
        msg = MIMEMultipart()
        msg['From'] = "test@gmail.com" if not config.SMTP_USER else config.SMTP_USER
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        
        # If no SMTP_USER is set, we print it to console for demo purposes to avoid crashing
        if not config.SMTP_USER:
            print(f"\n[Mock Email] To: {to_email} | Subject: {subject}")
            print(f"Body:\n{body}\n")
            return True
            
        server = smtplib.SMTP(config.SMTP_SERVER, config.SMTP_PORT)
        server.starttls()
        server.login(config.SMTP_USER, config.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

def send_otp_email(to_email: str, otp: str):
    subject = "HRMS Email Verification"
    body = f"Hello,\n\nYour OTP is\n\n{otp}\n\nIt is valid for 5 minutes.\n\nIgnore this email if you did not request it."
    return send_email(to_email, subject, body)

def send_registration_success_email(to_email: str, company_name: str, company_id: int, db_name: str, admin_email: str, password: str):
    subject = "Welcome to HRMS"
    body = (
        "Congratulations!\n\n"
        "Your company account has been successfully created.\n\n"
        f"Company Name\n{company_name}\n\n"
        f"Company ID\n{company_id}\n\n"
        f"Database Name\n{db_name}\n\n"
        f"Admin Email\n{admin_email}\n\n"
        f"Temporary Password / Selected Password\n{password}\n\n"
        "Please change your password after first login."
    )
    return send_email(to_email, subject, body)

def send_company_suspended_email(to_email: str):
    subject = "Company Account Suspended"
    body = (
        "Your company account has been temporarily suspended by the Super Administrator.\n\n"
        "During suspension\n"
        "Employees cannot login.\n"
        "HR cannot login.\n"
        "Admin cannot login.\n\n"
        "Please contact the Super Administrator."
    )
    return send_email(to_email, subject, body)

def send_company_activated_email(to_email: str):
    subject = "Company Account Activated"
    body = (
        "Your company account has been activated.\n\n"
        "All users may login again."
    )
    return send_email(to_email, subject, body)

def send_deletion_warning_email(to_email: str):
    subject = "Company Deletion Warning"
    body = (
        "WARNING\n\n"
        "Your company has been marked for permanent deletion.\n\n"
        "Please contact the Super Administrator immediately if this is unexpected."
    )
    return send_email(to_email, subject, body)

def send_welcome_email(to_email: str, emp_id: str, temp_password: str, company_name: str, role: str):
    subject = f"Welcome to {company_name}"
    body = (
        f"Welcome to {company_name}!\n\n"
        f"Your {role} account has been successfully created.\n\n"
        f"Employee ID: {emp_id}\n"
        f"Temporary Password: {temp_password}\n\n"
        "Instruction: Please change your password after your first login."
    )
    return send_email(to_email, subject, body)
