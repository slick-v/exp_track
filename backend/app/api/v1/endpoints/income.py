from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models import User, Account, Income
from app.schemas import IncomeCreate, IncomeResponse
from app.repositories.income_repository import get_user_income, get_income_by_id

router = APIRouter()

@router.post("/income", response_model=IncomeResponse)
def create_income(
    income_in: IncomeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    account = db.query(Account).filter(
        Account.id == income_in.account_id,
        Account.user_id == current_user.id,
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    new_income = Income(
        user_id=current_user.id,
        account_id=income_in.account_id,
        amount=income_in.amount,
        source=income_in.source,
        income_date=income_in.income_date,
        notes=income_in.notes,
    )
    db.add(new_income)
    db.commit()
    db.refresh(new_income)
    return new_income


@router.get("/income", response_model=List[IncomeResponse])
def list_income(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_income(db, current_user.id)


@router.put("/income/{income_id}", response_model=IncomeResponse)
def update_income(
    income_id: int,
    income_in: IncomeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    income = get_income_by_id(db, income_id, current_user.id)
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")

    account = db.query(Account).filter(
        Account.id == income_in.account_id,
        Account.user_id == current_user.id,
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    income.amount = income_in.amount
    income.account_id = income_in.account_id
    income.source = income_in.source
    income.income_date = income_in.income_date
    income.notes = income_in.notes

    db.commit()
    db.refresh(income)
    return income


@router.delete("/income/{income_id}", status_code=204)
def delete_income(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    income = get_income_by_id(db, income_id, current_user.id)
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")

    income.deleted_at = datetime.now(timezone.utc)
    db.commit()