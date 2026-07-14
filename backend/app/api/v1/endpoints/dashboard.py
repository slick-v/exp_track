from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models import User
from app.schemas import DashboardSummary
from app.repositories.dashboard_repository import get_total_expenses, get_total_income

router = APIRouter()


@router.get("/dashboard/summary", response_model=DashboardSummary)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()
    month_start = today.replace(day=1)

    total_income = get_total_income(db, current_user.id)
    total_expenses = get_total_expenses(db, current_user.id)
    month_income = get_total_income(db, current_user.id, start_date=month_start)
    month_expenses = get_total_expenses(db, current_user.id, start_date=month_start)

    return DashboardSummary(
        total_income=total_income,
        total_expenses=total_expenses,
        current_balance=total_income - total_expenses,
        month_income=month_income,
        month_expenses=month_expenses,
    )