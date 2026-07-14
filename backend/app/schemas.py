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