import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().with_name('campus_emergency.db')

if not DB_PATH.exists():
    raise FileNotFoundError(
        f"Database file not found: {DB_PATH}\n"
        "The script refuses to create a new database in this location. "
        "Please verify the file exists before running this script."
    )

conn = sqlite3.connect(str(DB_PATH))
conn.row_factory = sqlite3.Row
cur = conn.cursor()

print(f"Database: {DB_PATH}")
print("\nChecking SQLite tables...\n")

tables = cur.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
).fetchall()

if not tables:
    print("No user tables found in this database.")
    conn.close()
    raise SystemExit(0)

for table_row in tables:
    table_name = table_row['name']
    columns = cur.execute(f'PRAGMA table_info("{table_name}")').fetchall()
    column_names = [col['name'] for col in columns]
    row_count = cur.execute(f'SELECT COUNT(*) AS count FROM "{table_name}"').fetchone()['count']

    print(f"Table: {table_name}")
    print(f"  Columns: {column_names}")
    print(f"  Record count: {row_count}")
    print()

conn.close()
