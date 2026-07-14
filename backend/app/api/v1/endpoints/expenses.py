from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models import User, Expense, Category, Account
from app.schemas import ExpenseCreate, ExpenseResponse



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
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
        .order_by(Expense.expense_date.desc())
        .all()
    )