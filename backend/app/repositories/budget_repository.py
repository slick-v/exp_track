from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import Budget, Expense


def get_user_budgets(db: Session, user_id: int, month: date):
    return db.query(Budget).filter(Budget.user_id == user_id, Budget.month == month).all()


def get_spent_amount(db: Session, user_id: int, month: date, category_id: int | None) -> float:
    query = db.query(func.coalesce(func.sum(Expense.amount), 0)).filter(
        Expense.user_id == user_id,
        Expense.deleted_at.is_(None),
        func.date_trunc("month", Expense.expense_date) == month,
    )
    if category_id is not None:
        query = query.filter(Expense.category_id == category_id)
    return query.scalar()