from pydantic import BaseModel, EmailStr
from datetime import datetime
from decimal import Decimal
from datetime import date


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None



class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


from typing import Literal

class CategoryResponse(BaseModel):
    id: int
    name: str
    is_default: bool

    class Config:
        from_attributes = True

class AccountResponse(BaseModel):
    id: int
    name: str
    account_type: str
    is_default: bool

    class Config:
        from_attributes = True

class AccountCreate(BaseModel):
    name: str
    account_type: Literal["cash", "upi", "bank", "credit_card", "wallet"]




class ExpenseCreate(BaseModel):
    amount: Decimal
    category_id: int
    account_id: int
    merchant: str | None = None
    expense_date: date
    notes: str | None = None
    tags: str | None = None

class ExpenseResponse(BaseModel):
    id: int
    amount: Decimal
    category_id: int
    account_id: int
    merchant: str | None
    expense_date: date
    notes: str | None
    tags: str | None
    created_at: datetime

    class Config:
        from_attributes = True




class IncomeCreate(BaseModel):
    amount: Decimal
    account_id: int
    source: str | None = None
    income_date: date
    notes: str | None = None

class IncomeResponse(BaseModel):
    id: int
    amount: Decimal
    account_id: int
    source: str | None
    income_date: date
    notes: str | None
    created_at: datetime

    class Config:
        from_attributes = True



class DashboardSummary(BaseModel):
    total_income: Decimal
    total_expenses: Decimal
    current_balance: Decimal
    month_income: Decimal
    month_expenses: Decimal


class BudgetCreate(BaseModel):
    category_id: int | None = None
    month: date
    limit_amount: Decimal

class BudgetResponse(BaseModel):
    id: int
    category_id: int | None
    month: date
    limit_amount: Decimal

    class Config:
        from_attributes = True

class BudgetStatus(BaseModel):
    budget: BudgetResponse
    spent: Decimal
    remaining: Decimal
    percent_used: float
    is_over_budget: bool


class GoalCreate(BaseModel):
    name: str
    target_amount: Decimal
    target_date: date | None = None

class GoalContribution(BaseModel):
    amount: Decimal

class GoalResponse(BaseModel):
    id: int
    name: str
    target_amount: Decimal
    current_amount: Decimal
    target_date: date | None
    percent_complete: float

    class Config:
        from_attributes = True