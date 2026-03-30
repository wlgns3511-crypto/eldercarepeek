#!/usr/bin/env python3
"""
Expand ElderCarePeek with ZIP-level eldercare cost estimates.
Uses ZipPeek demographics + state-level eldercare costs.
"""

import sqlite3
import os
import re

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'eldercare.db')
ZIPPEEK_DB = os.path.join(os.path.dirname(__file__), '..', '..', 'zippeek', 'data', 'zippeek.db')

US_STATES = {
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
    'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
    'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
    'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
    'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
}


def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def main():
    print("=== ElderCarePeek ZIP Expansion ===\n")

    conn = sqlite3.connect(DB_PATH)

    # Load state eldercare costs
    state_costs = {}
    for r in conn.execute('SELECT abbr, nursing_home_private, nursing_home_semi, assisted_living, home_health_aide_hourly, adult_day_care FROM states').fetchall():
        state_costs[r[0]] = {
            'nursing_private': r[1], 'nursing_semi': r[2],
            'assisted': r[3], 'hha_hourly': r[4], 'adult_day': r[5]
        }

    # Create zip_eldercare table
    conn.execute('DROP TABLE IF EXISTS zip_eldercare')
    conn.execute('''
        CREATE TABLE zip_eldercare (
            zip_code TEXT PRIMARY KEY,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            population INTEGER,
            median_income INTEGER,
            median_age REAL,
            nursing_home_private REAL,
            nursing_home_semi REAL,
            assisted_living REAL,
            home_health_aide_hourly REAL,
            adult_day_care REAL,
            care_affordability_pct REAL
        )
    ''')
    conn.execute('CREATE INDEX idx_ze_state ON zip_eldercare(state)')
    conn.execute('CREATE INDEX idx_ze_slug ON zip_eldercare(slug)')

    # Load ZipPeek data
    zconn = sqlite3.connect(ZIPPEEK_DB)
    zconn.row_factory = sqlite3.Row
    zips = zconn.execute('SELECT zip_code, city, state, population, median_income, median_age FROM zips').fetchall()
    zconn.close()

    inserted = 0
    for z in zips:
        state = z['state']
        effective_state = 'MD' if state == 'DC' else state
        if state not in US_STATES or effective_state not in state_costs:
            continue

        sc = state_costs[effective_state]
        income = z['median_income'] or 0

        # Care affordability: assisted_living_monthly / monthly_income * 100
        affordability = round(sc['assisted'] / (income / 12) * 100, 1) if income > 0 and sc['assisted'] else None

        slug = f"{z['zip_code']}-{slugify(z['city'])}-{state.lower()}-eldercare"

        conn.execute('''
            INSERT OR IGNORE INTO zip_eldercare
            (zip_code, city, state, slug, population, median_income, median_age,
             nursing_home_private, nursing_home_semi, assisted_living,
             home_health_aide_hourly, adult_day_care, care_affordability_pct)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            z['zip_code'], z['city'], state, slug,
            z['population'], income, z['median_age'],
            sc['nursing_private'], sc['nursing_semi'], sc['assisted'],
            sc['hha_hourly'], sc['adult_day'], affordability
        ))
        inserted += 1

        if inserted % 5000 == 0:
            conn.commit()
            print(f"  {inserted} inserted...")

    conn.commit()
    total = conn.execute('SELECT COUNT(*) FROM zip_eldercare').fetchone()[0]
    print(f"\n=== Done ===")
    print(f"  Inserted: {inserted}")
    print(f"  Total: {total}")
    conn.close()


if __name__ == '__main__':
    main()
