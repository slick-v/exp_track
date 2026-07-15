from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models import User, Goal
from app.schemas import GoalCreate, GoalResponse, GoalContribution

router = APIRouter()


def _to_response(goal: Goal) -> GoalResponse:
    percent = float(goal.current_amount / goal.target_amount * 100) if goal.target_amount > 0 else 0.0
    return GoalResponse(
        id=goal.id,
        name=goal.name,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        target_date=goal.target_date,
        percent_complete=round(min(percent, 100.0), 1),
    )


@router.post("/goals", response_model=GoalResponse)
def create_goal(
    goal_in: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_goal = Goal(
        user_id=current_user.id,
        name=goal_in.name,
        target_amount=goal_in.target_amount,
        target_date=goal_in.target_date,
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return _to_response(new_goal)


@router.get("/goals", response_model=List[GoalResponse])
def list_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    return [_to_response(g) for g in goals]


@router.post("/goals/{goal_id}/contribute", response_model=GoalResponse)
def contribute_to_goal(
    goal_id: int,
    contribution: GoalContribution,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    goal.current_amount = goal.current_amount + contribution.amount
    db.commit()
    db.refresh(goal)
    return _to_response(goal)