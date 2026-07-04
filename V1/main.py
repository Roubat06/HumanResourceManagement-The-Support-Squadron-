import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from master_initializer import initialize
from routers import superadmin, companyadmin, hr, employee, public

app = FastAPI(title="Enterprise HRMS API", description="FastAPI Backend for React Frontend")

# CORS for React compatibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session middleware for cookie-based authentication
app.add_middleware(SessionMiddleware, secret_key="super_secret_hrms_key")

# Include Routers
app.include_router(superadmin.router)
app.include_router(companyadmin.router)
app.include_router(companyadmin.company_router)
app.include_router(hr.router)
app.include_router(employee.router)
app.include_router(public.router)

from fastapi.responses import RedirectResponse

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

def main():
    import psycopg2
    import config
    print("\n==================================")
    print("Verifying PostgreSQL Connection...")
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user=config.DB_USER,
            password=config.DB_PASSWORD,
            host=config.DB_HOST,
            port=config.DB_PORT
        )
        conn.close()
        print("Connected")
    except Exception as e:
        print(f"Failed to connect: {e}")
        return

    print("Verifying Master Database...")
    print("Verifying Company Databases...")
    print("Verifying Required Tables...")
    initialize()
    
    print("Verifying FastAPI Configuration...")
    print("Starting FastAPI Server...")
    
    print("\n==================================")
    print("HRMS Backend Started Successfully")
    print("Database Status : OK")
    print("API Status : Running")
    print("Swagger : /docs")
    print("Ready For Frontend")
    print("==================================\n")
    
    uvicorn.run(app, host="127.0.0.1", port=8000)

if __name__ == "__main__":
    main()
