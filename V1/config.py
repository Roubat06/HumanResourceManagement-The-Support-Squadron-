import os

# Default PostgreSQL connection settings
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = os.environ.get("DB_PORT", "1567")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "12345")

# Master Database settings
MASTER_DB_NAME = "hrms_master"

# Default Super Admin credentials
DEFAULT_SUPER_ADMIN_NAME = "System Admin"
DEFAULT_SUPER_ADMIN_EMAIL = "suranjanc2006@gmail.com"
DEFAULT_SUPER_ADMIN_PASSWORD = "1410@kcS%"

# SMTP Settings
SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USER = os.environ.get("SMTP_USER", "suranjanc2006@gmail.com")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "weuu exra oyzj jgmg")
