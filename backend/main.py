from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware



from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(title="Expense Tracker API")



app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Hello from the expense tracker backend", "env": settings.ENVIRONMENT}