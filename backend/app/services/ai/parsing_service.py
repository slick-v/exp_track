import json
from decimal import Decimal, InvalidOperation
from groq import Groq
from pydantic import BaseModel, ValidationError

from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


class ParsedExpenseItem(BaseModel):
    amount: Decimal
    category_guess: str
    merchant: str | None = None


PARSE_SYSTEM_PROMPT = """You extract expense entries from natural language text.
Return ONLY a JSON array, no other text. Each item must have exactly these fields:
- amount: a number (no currency symbols)
- category_guess: one of [Food, Grocery, Fuel, Shopping, Bills, Health, Entertainment, Travel, Education, Other]
- merchant: a short string describing what it was for, or null

Example input: "I spent 250 on lunch and 700 on groceries"
Example output: [{"amount": 250, "category_guess": "Food", "merchant": "lunch"}, {"amount": 700, "category_guess": "Grocery", "merchant": "groceries"}]
"""


def parse_expense_text(text: str) -> list[ParsedExpenseItem]:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": PARSE_SYSTEM_PROMPT},
            {"role": "user", "content": text},
        ],
        temperature=0,
        response_format={"type": "json_object"} if False else None,
    )

    raw_content = response.choices[0].message.content

    try:
        parsed_json = json.loads(raw_content)
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON — could not parse expense text")

    items = []
    for entry in parsed_json:
        try:
            items.append(ParsedExpenseItem(**entry))
        except (ValidationError, InvalidOperation):
            continue  # skip malformed individual entries rather than failing the whole batch

    if not items:
        raise ValueError("Could not extract any valid expenses from the given text")

    return items