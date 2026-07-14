from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models import User, Account
from app.schemas import AccountResponse, AccountCreate

router = APIRouter()

@router.get("/accounts", response_model=List[AccountResponse])
def list_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Account).filter(Account.user_id == current_user.id).all()

@router.post("/accounts", response_model=AccountResponse)
def create_account(
    account_in: AccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_account = Account(
        name=account_in.name,
        account_type=account_in.account_type,
        user_id=current_user.id,
        is_default=False,
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account