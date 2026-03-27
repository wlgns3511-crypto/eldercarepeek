#!/usr/bin/env python3
import sqlite3, os

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'eldercare.db')
conn = sqlite3.connect(DB_PATH)

conn.execute("""
CREATE TABLE IF NOT EXISTS city_comparisons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    city_a_slug TEXT NOT NULL,
    city_b_slug TEXT NOT NULL
)
""")

# Top 150 cities (by id = order inserted, presumably by population/importance)
cities = conn.execute("SELECT slug FROM cities ORDER BY id LIMIT 150").fetchall()
slugs = [r[0] for r in cities]

batch = []
for i in range(len(slugs)):
    for j in range(i+1, len(slugs)):
        a, b = sorted([slugs[i], slugs[j]])
        slug = f"{a}-vs-{b}"
        batch.append((slug, a, b))

conn.executemany(
    "INSERT OR IGNORE INTO city_comparisons (slug, city_a_slug, city_b_slug) VALUES (?,?,?)",
    batch
)
conn.commit()
count = conn.execute("SELECT COUNT(*) FROM city_comparisons").fetchone()[0]
print(f"✅ city_comparisons: {count:,} rows")
conn.close()
