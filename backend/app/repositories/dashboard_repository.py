from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import Expense, Income


def get_total_expenses(db: Session, user_id: int, start_date: date | None = None) -> Decimal:
    query = db.query(func.coalesce(func.sum(Expense.amount), 0)).filter(
        Expense.user_id == user_id,
        Expense.deleted_at.is_(None),
    )
    if start_date:
        query = query.filter(Expense.expense_date >= start_date)
    return query.scalar()


def get_total_income(db: Session, user_id: int, start_date: date | None = None) -> Decimal:
    query = db.query(func.coalesce(func.sum(Income.amount), 0)).filter(
        Income.user_id == user_id,
        Income.deleted_at.is_(None),
    )
    if start_date:
        query = query.filter(Income.income_date >= start_date)
    return query.scalar()