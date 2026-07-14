from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models import User, Expense, Category, Account
from app.schemas import ExpenseCreate, ExpenseResponse

from datetime import datetime, timezone
from app.repositories.eexpense_repository import get_user_expenses, get_expense_by_id

router = APIRouter()

@router.post("/expenses", response_model=ExpenseResponse)
def create_expense(
    expense_in: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = db.query(Category).filter(
        Category.id == expense_in.category_id,
        Category.user_id == current_user.id,
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    account = db.query(Account).filter(
        Account.id == expense_in.account_id,
        Account.user_id == current_user.id,
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    new_expense = Expense(
        user_id=current_user.id,
        category_id=expense_in.category_id,
        account_id=expense_in.account_id,
        amount=expense_in.amount,
        merchant=expense_in.merchant,
        expense_date=expense_in.expense_date,
        notes=expense_in.notes,
        tags=expense_in.tags,
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

@router.get("/expenses", response_model=List[ExpenseResponse])
def list_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        get_user_expenses(db, current_user.id)
    )






@router.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense_in: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = get_expense_by_id(db, expense_id, current_user.id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    category = db.query(Category).filter(
        Category.id == expense_in.category_id,
        Category.user_id == current_user.id,
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    account = db.query(Account).filter(
        Account.id == expense_in.account_id,
        Account.user_id == current_user.id,
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    expense.amount = expense_in.amount
    expense.category_id = expense_in.category_id
    expense.account_id = expense_in.account_id
    expense.merchant = expense_in.merchant
    expense.expense_date = expense_in.expense_date
    expense.notes = expense_in.notes
    expense.tags = expense_in.tags

    db.commit()
    db.refresh(expense)
    return expense

@router.get("/expenses/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = get_expense_by_id(db, expense_id, current_user.id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense



@router.delete("/expenses/{expense_id}", status_code=204)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = get_expense_by_id(db, expense_id, current_user.id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    expense.deleted_at = datetime.now(timezone.utc)
    db.commit()