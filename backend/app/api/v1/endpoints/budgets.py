from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models import User, Budget, Category
from app.schemas import BudgetCreate, BudgetResponse, BudgetStatus
from app.repositories.budget_repository import get_user_budgets, get_spent_amount

router = APIRouter()


@router.post("/budgets", response_model=BudgetResponse)
def create_budget(
    budget_in: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if budget_in.category_id is not None:
        category = db.query(Category).filter(
            Category.id == budget_in.category_id,
            Category.user_id == current_user.id,
        ).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

    month_start = budget_in.month.replace(day=1)

    new_budget = Budget(
        user_id=current_user.id,
        category_id=budget_in.category_id,
        month=month_start,
        limit_amount=budget_in.limit_amount,
    )
    db.add(new_budget)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="A budget for this category and month already exists")
    db.refresh(new_budget)
    return new_budget


@router.get("/budgets/status", response_model=List[BudgetStatus])
def budget_status(
    month: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    month_start = month.replace(day=1)
    budgets = get_user_budgets(db, current_user.id, month_start)

    results = []
    for budget in budgets:
        spent = get_spent_amount(db, current_user.id, month_start, budget.category_id)
        remaining = budget.limit_amount - spent
        percent_used = float(spent / budget.limit_amount * 100) if budget.limit_amount > 0 else 0.0

        results.append(BudgetStatus(
            budget=budget,
            spent=spent,
            remaining=remaining,
            percent_used=round(percent_used, 1),
            is_over_budget=spent > budget.limit_amount,
        ))

    return results