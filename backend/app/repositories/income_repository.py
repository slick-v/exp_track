from sqlalchemy.orm import Session
from app.models import Income

def get_user_income(db: Session, user_id: int):
    return (
        db.query(Income)
        .filter(Income.user_id == user_id, Income.deleted_at.is_(None))
        .order_by(Income.income_date.desc())
        .all()
    )

def get_income_by_id(db: Session, income_id: int, user_id: int):
    return (
        db.query(Income)
        .filter(
            Income.id == income_id,
            Income.user_id == user_id,
            Income.deleted_at.is_(None),
        )
        .first()
    )