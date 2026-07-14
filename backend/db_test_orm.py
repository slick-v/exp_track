from backend.app.core.database import engine
from sqlalchemy import text


with engine.connect() as conn:
    result = conn.execute(text("SELECT version();"))
    row = result.fetchone()
    print("Connected via SQLAlchemy!")
    print("Postgres version:", row[0])