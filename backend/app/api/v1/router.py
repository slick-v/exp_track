from fastapi import APIRouter
from app.api.v1.endpoints import auth, categories, accounts, expenses,income, dashboard, budgets

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(categories.router, tags=["categories"])
api_router.include_router(accounts.router, tags=["accounts"])
api_router.include_router(expenses.router, tags=["expenses"])
api_router.include_router(income.router, tags=["income"])
api_router.include_router(dashboard.router, tags=["dashboard"])
api_router.include_router(budgets.router, tags=["budgets"])