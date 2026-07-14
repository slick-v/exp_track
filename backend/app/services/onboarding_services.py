from sqlalchemy.orm import Session

from app.models import Category, Account
from app.core.deafaults import DEFAULT_CATEGORIES, DEFAULT_ACCOUNTS

def seed_defaults_for_user(db: Session, user_id: int) -> None:
    for name in DEFAULT_CATEGORIES:
        db.add(Category(name=name, user_id=user_id, is_default=True))

    for name, account_type in DEFAULT_ACCOUNTS:
        db.add(Account(name=name, account_type=account_type, user_id=user_id, is_default=True))