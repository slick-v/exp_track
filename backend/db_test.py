import psycopg2
from backend.app.core.config import settings


conn = psycopg2.connect(settings.DATABASE_URL)
cursor = conn.cursor()


cursor.execute("SELECT version();")
result = cursor.fetchone()

print("Connected Succesfully!")
print("Postgres version:", result[0])

cursor.close()
conn.close()