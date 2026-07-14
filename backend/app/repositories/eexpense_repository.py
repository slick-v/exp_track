from sqlalchemy.orm import Session
from app.models import Expense

def get_user_expenses(db: Session, user_id: int):
    return (
        db.query(Expense)
        .filter(Expense.user_id == user_id, Expense.deleted_at.is_(None))
        .order_by(Expense.expense_date.desc())
        .all()
    )

def get_expense_by_id(db: Session, expense_id: int, user_id: int):
    return (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == user_id,
            Expense.deleted_at.is_(None),
        )
        .first()
    )