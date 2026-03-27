#!/usr/bin/env python3
"""Build eldercare.db with realistic US senior care cost data."""

import sqlite3
import os
import random
import math

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'eldercare.db')

# --- State data based on Genworth Cost of Care Survey 2024 ranges ---
# Format: (state, abbr, nursing_private, nursing_semi, assisted_living,
#          hha_hourly, adult_day, homemaker_hourly, median_income, senior_pct, medicaid_notes)

STATES_RAW = [
    ("Alabama", "AL", 7756, 6935, 3750, 21.00, 1517, 20.00, 56950, 17.4, "Medicaid covers nursing home care for eligible residents. Alabama Medicaid waiver programs available for home and community-based services."),
    ("Alaska", "AK", 13250, 12410, 6488, 33.00, 2167, 31.00, 77790, 12.5, "Alaska Medicaid covers nursing facility services. Home and Community-Based waiver available. Higher costs reflect remote geography."),
    ("Arizona", "AZ", 8913, 7985, 4500, 27.00, 1733, 25.00, 65913, 18.2, "Arizona Long Term Care System (ALTCS) provides Medicaid coverage for long-term care. Extensive HCBS waiver options."),
    ("Arkansas", "AR", 6844, 6083, 3800, 21.00, 1300, 19.50, 52123, 17.5, "Arkansas Medicaid covers nursing home care. ARChoices waiver for home-based services. Among the lowest cost states."),
    ("California", "CA", 11502, 10220, 5750, 32.00, 2017, 30.00, 84097, 15.2, "Medi-Cal covers nursing facility care. Multipurpose Senior Services Program (MSSP) and other waivers for community care."),
    ("Colorado", "CO", 9963, 8883, 5038, 29.00, 1733, 27.00, 80184, 14.7, "Colorado Medicaid covers nursing facilities. HCBS waivers include Elderly, Blind and Disabled (EBD) waiver."),
    ("Connecticut", "CT", 13992, 12775, 5750, 28.00, 2200, 26.00, 83771, 17.7, "Connecticut Medicaid covers nursing home care. Connecticut Home Care Program for Elders provides extensive community services."),
    ("Delaware", "DE", 10830, 9963, 5750, 26.00, 1833, 24.00, 72724, 19.4, "Delaware Medicaid covers nursing facility care. Diamond State Health Plan Plus provides HCBS waiver services."),
    ("Florida", "FL", 9963, 9048, 4385, 26.00, 1733, 24.00, 63062, 21.3, "Florida Medicaid covers nursing home care. Statewide Medicaid Managed Care Long-Term Care Program available."),
    ("Georgia", "GA", 7908, 7148, 3750, 22.00, 1517, 20.50, 65030, 14.6, "Georgia Medicaid covers nursing facility services. Community Care Services Program (CCSP) waiver available."),
    ("Hawaii", "HI", 13250, 11960, 5250, 33.00, 1767, 31.00, 84857, 19.0, "Hawaii Medicaid covers nursing facilities. QUEST Integration provides managed care including HCBS."),
    ("Idaho", "ID", 9506, 8517, 4250, 27.00, 1600, 25.00, 63377, 16.1, "Idaho Medicaid covers nursing home care. Aged and Disabled waiver provides home-based alternatives."),
    ("Illinois", "IL", 7148, 6540, 4750, 26.00, 1650, 24.00, 72205, 16.1, "Illinois Medicaid covers nursing facilities. Community Care Program and various HCBS waivers available."),
    ("Indiana", "IN", 8304, 7452, 4250, 24.00, 1517, 22.00, 61944, 16.5, "Indiana Medicaid covers nursing home care. Aged & Disabled waiver provides community-based alternatives."),
    ("Iowa", "IA", 7604, 6844, 4250, 25.00, 1733, 23.00, 65573, 17.8, "Iowa Medicaid managed care covers nursing facilities. HCBS Elderly waiver for community services."),
    ("Kansas", "KS", 7452, 6692, 4500, 24.00, 1650, 22.50, 64521, 16.4, "Kansas Medicaid covers nursing facility care. HCBS Frail Elderly waiver provides community-based options."),
    ("Kentucky", "KY", 7756, 6935, 3750, 22.00, 1300, 20.00, 55573, 17.0, "Kentucky Medicaid covers nursing home care. Home and Community Based waiver (HCB) available for eligible seniors."),
    ("Louisiana", "LA", 6540, 5780, 3500, 20.00, 1383, 18.50, 52295, 15.9, "Louisiana Medicaid covers nursing facilities. Community Choices waiver for home and community-based services."),
    ("Maine", "ME", 10373, 9506, 5500, 28.00, 2017, 26.00, 64767, 21.2, "Maine Medicaid covers nursing facility care. Section 19 and 29 waivers for home-based care options."),
    ("Maryland", "MD", 10982, 10068, 4750, 26.00, 1833, 24.00, 90203, 15.6, "Maryland Medicaid covers nursing homes. Community Options waiver and other HCBS programs available."),
    ("Massachusetts", "MA", 13992, 12167, 5750, 30.00, 2100, 28.00, 89026, 17.0, "MassHealth covers nursing facility care. Frail Elder waiver and Senior Care Options program available."),
    ("Michigan", "MI", 9354, 8517, 4250, 25.00, 1600, 23.00, 63202, 17.7, "Michigan Medicaid covers nursing homes. MI Choice waiver provides home and community-based services."),
    ("Minnesota", "MN", 10830, 9963, 4750, 29.00, 1900, 27.00, 77706, 16.3, "Minnesota Medicaid covers nursing facility care. Elderly waiver for community-based alternatives."),
    ("Mississippi", "MS", 7300, 6540, 3500, 19.00, 1250, 17.50, 48610, 16.4, "Mississippi Medicaid covers nursing home care. Elderly and Disabled waiver for home services. Lowest cost region."),
    ("Missouri", "MO", 6236, 5628, 3263, 22.00, 1383, 20.00, 60905, 17.2, "Missouri Medicaid covers nursing facilities. Aged and Disabled waiver provides community alternatives."),
    ("Montana", "MT", 9506, 8517, 4500, 28.00, 1650, 26.00, 60560, 18.9, "Montana Medicaid covers nursing home care. Big Sky waiver for home and community-based services."),
    ("Nebraska", "NE", 8608, 7756, 4250, 26.00, 1600, 24.00, 66644, 16.4, "Nebraska Medicaid covers nursing facilities. Aged and Disabled waiver for community-based services."),
    ("Nevada", "NV", 9354, 8304, 4250, 27.00, 1517, 25.00, 65686, 16.1, "Nevada Medicaid covers nursing home care. Home and Community-Based waiver available for eligible seniors."),
    ("New Hampshire", "NH", 12167, 11135, 5500, 29.00, 2017, 27.00, 83449, 18.7, "New Hampshire Medicaid covers nursing facilities. Choices for Independence waiver for community care."),
    ("New Jersey", "NJ", 12167, 10982, 5950, 27.00, 2100, 25.00, 89296, 16.6, "New Jersey Medicaid covers nursing home care. MLTSS (Managed Long Term Services and Supports) for community options."),
    ("New Mexico", "NM", 8760, 7908, 4250, 24.00, 1517, 22.00, 53992, 18.0, "New Mexico Medicaid covers nursing facilities. Mi Via and Centennial Care HCBS waivers available."),
    ("New York", "NY", 13250, 11745, 5500, 27.00, 2350, 25.00, 74314, 16.9, "New York Medicaid covers nursing homes. Managed Long Term Care (MLTC) plans coordinate community services."),
    ("North Carolina", "NC", 8304, 7452, 4250, 23.00, 1517, 21.00, 61972, 17.0, "North Carolina Medicaid covers nursing facility care. Community Alternatives Program waivers available."),
    ("North Dakota", "ND", 10373, 9354, 4250, 28.00, 1733, 26.00, 68131, 16.5, "North Dakota Medicaid covers nursing homes. SPED waiver for home-based services."),
    ("Ohio", "OH", 8304, 7604, 4500, 23.00, 1650, 21.50, 59855, 17.5, "Ohio Medicaid covers nursing facility care. PASSPORT waiver for home-based alternatives."),
    ("Oklahoma", "OK", 6844, 6083, 3750, 22.00, 1383, 20.00, 55826, 16.1, "Oklahoma Medicaid covers nursing homes. ADvantage waiver program for community-based services."),
    ("Oregon", "OR", 10982, 9963, 5500, 30.00, 1900, 28.00, 70084, 18.2, "Oregon Medicaid covers nursing facilities. Oregon Project Independence and K Plan for community care."),
    ("Pennsylvania", "PA", 10068, 9050, 4500, 25.00, 1733, 23.00, 67587, 18.7, "Pennsylvania Medicaid covers nursing home care. LIFE program and aging waiver for community services."),
    ("Rhode Island", "RI", 10830, 9963, 5250, 28.00, 2100, 26.00, 71169, 18.0, "Rhode Island Medicaid covers nursing facilities. Global consumer choice compact waiver available."),
    ("South Carolina", "SC", 7604, 6844, 3750, 22.00, 1383, 20.00, 59318, 18.2, "South Carolina Medicaid covers nursing home care. Community Choices waiver for home-based services."),
    ("South Dakota", "SD", 8304, 7452, 4000, 26.00, 1517, 24.00, 63920, 17.2, "South Dakota Medicaid covers nursing facilities. HOPE waiver for community-based alternatives."),
    ("Tennessee", "TN", 7452, 6692, 4000, 22.00, 1383, 20.50, 57153, 16.7, "TennCare covers nursing home care. CHOICES program provides home and community-based services."),
    ("Texas", "TX", 6083, 5476, 4178, 23.00, 1083, 21.00, 67321, 13.0, "Texas Medicaid covers nursing facilities. STAR+PLUS managed care and Community Based Alternatives waiver."),
    ("Utah", "UT", 8304, 7452, 3750, 25.00, 1383, 23.00, 74197, 11.4, "Utah Medicaid covers nursing home care. Aging waiver and New Choices waiver for community options."),
    ("Vermont", "VT", 10982, 9963, 5500, 29.00, 2017, 27.00, 63477, 20.1, "Vermont Medicaid (Green Mountain Care) covers nursing facilities. Choices for Care program provides HCBS."),
    ("Virginia", "VA", 8913, 8000, 4750, 24.00, 1733, 22.50, 80615, 15.9, "Virginia Medicaid covers nursing home care. Commonwealth Coordinated Care Plus for community services."),
    ("Washington", "WA", 10982, 9963, 5750, 31.00, 2017, 29.00, 82228, 15.9, "Washington Medicaid covers nursing facilities. COPES waiver for home and community-based alternatives."),
    ("West Virginia", "WV", 10068, 9050, 4250, 22.00, 1517, 20.00, 50343, 20.5, "West Virginia Medicaid covers nursing home care. Aged and Disabled waiver for community services."),
    ("Wisconsin", "WI", 9963, 8913, 4750, 27.00, 1733, 25.00, 67125, 17.5, "Wisconsin Medicaid covers nursing facilities. Family Care and IRIS programs for community-based care."),
    ("Wyoming", "WY", 9963, 8913, 4500, 28.00, 1650, 26.00, 65003, 16.5, "Wyoming Medicaid covers nursing home care. Long Term Care waiver for home-based services."),
]

# --- Cities (top 200 metro areas) ---
CITIES_RAW = [
    ("New York", "NY"), ("Los Angeles", "CA"), ("Chicago", "IL"), ("Houston", "TX"),
    ("Phoenix", "AZ"), ("Philadelphia", "PA"), ("San Antonio", "TX"), ("San Diego", "CA"),
    ("Dallas", "TX"), ("San Jose", "CA"), ("Austin", "TX"), ("Jacksonville", "FL"),
    ("Fort Worth", "TX"), ("Columbus", "OH"), ("Indianapolis", "IN"), ("Charlotte", "NC"),
    ("San Francisco", "CA"), ("Seattle", "WA"), ("Denver", "CO"), ("Nashville", "TN"),
    ("Oklahoma City", "OK"), ("Washington", "DC"), ("El Paso", "TX"), ("Las Vegas", "NV"),
    ("Boston", "MA"), ("Portland", "OR"), ("Memphis", "TN"), ("Louisville", "KY"),
    ("Baltimore", "MD"), ("Milwaukee", "WI"), ("Albuquerque", "NM"), ("Tucson", "AZ"),
    ("Fresno", "CA"), ("Sacramento", "CA"), ("Mesa", "AZ"), ("Kansas City", "MO"),
    ("Atlanta", "GA"), ("Omaha", "NE"), ("Colorado Springs", "CO"), ("Raleigh", "NC"),
    ("Long Beach", "CA"), ("Virginia Beach", "VA"), ("Miami", "FL"), ("Oakland", "CA"),
    ("Minneapolis", "MN"), ("Tampa", "FL"), ("Tulsa", "OK"), ("Arlington", "TX"),
    ("New Orleans", "LA"), ("Wichita", "KS"), ("Cleveland", "OH"), ("Bakersfield", "CA"),
    ("Aurora", "CO"), ("Anaheim", "CA"), ("Honolulu", "HI"), ("Santa Ana", "CA"),
    ("Riverside", "CA"), ("Corpus Christi", "TX"), ("Lexington", "KY"), ("Henderson", "NV"),
    ("Stockton", "CA"), ("St. Paul", "MN"), ("Pittsburgh", "PA"), ("Cincinnati", "OH"),
    ("Anchorage", "AK"), ("Greensboro", "NC"), ("Plano", "TX"), ("Lincoln", "NE"),
    ("Orlando", "FL"), ("Irvine", "CA"), ("Newark", "NJ"), ("Durham", "NC"),
    ("Chula Vista", "CA"), ("Toledo", "OH"), ("Fort Wayne", "IN"), ("St. Petersburg", "FL"),
    ("Laredo", "TX"), ("Jersey City", "NJ"), ("Chandler", "AZ"), ("Madison", "WI"),
    ("Lubbock", "TX"), ("Scottsdale", "AZ"), ("Reno", "NV"), ("Buffalo", "NY"),
    ("Gilbert", "AZ"), ("Glendale", "AZ"), ("North Las Vegas", "NV"), ("Winston-Salem", "NC"),
    ("Chesapeake", "VA"), ("Norfolk", "VA"), ("Fremont", "CA"), ("Garland", "TX"),
    ("Irving", "TX"), ("Hialeah", "FL"), ("Richmond", "VA"), ("Boise", "ID"),
    ("Spokane", "WA"), ("Baton Rouge", "LA"), ("Des Moines", "IA"), ("Tacoma", "WA"),
    ("San Bernardino", "CA"), ("Modesto", "CA"), ("Fontana", "CA"), ("Moreno Valley", "CA"),
    ("Santa Clarita", "CA"), ("Birmingham", "AL"), ("Oxnard", "CA"), ("Rochester", "NY"),
    ("Port St. Lucie", "FL"), ("Grand Rapids", "MI"), ("Huntsville", "AL"), ("Salt Lake City", "UT"),
    ("Fayetteville", "NC"), ("Yonkers", "NY"), ("Amarillo", "TX"), ("Glendale", "CA"),
    ("Little Rock", "AR"), ("Knoxville", "TN"), ("Akron", "OH"), ("Brownsville", "TX"),
    ("Chattanooga", "TN"), ("Providence", "RI"), ("Fort Lauderdale", "FL"),
    ("Tempe", "AZ"), ("Overland Park", "KS"), ("Garden Grove", "CA"), ("Oceanside", "CA"),
    ("Rancho Cucamonga", "CA"), ("Santa Rosa", "CA"), ("Ontario", "CA"), ("Elk Grove", "CA"),
    ("Salem", "OR"), ("Cary", "NC"), ("Palm Bay", "FL"), ("Eugene", "OR"),
    ("Peoria", "AZ"), ("McKinney", "TX"), ("Sioux Falls", "SD"), ("Springfield", "MO"),
    ("Dayton", "OH"), ("Pomona", "CA"), ("Jackson", "MS"), ("Bellevue", "WA"),
    ("Surprise", "AZ"), ("Naperville", "IL"), ("Escondido", "CA"), ("Sunnyvale", "CA"),
    ("Savannah", "GA"), ("Bridgeport", "CT"), ("Roseville", "CA"), ("Joliet", "IL"),
    ("Paterson", "NJ"), ("Torrance", "CA"), ("Columbia", "SC"), ("Carrollton", "TX"),
    ("Midland", "TX"), ("Macon", "GA"), ("Pasadena", "TX"), ("Thornton", "CO"),
    ("Miramar", "FL"), ("Frisco", "TX"), ("Sterling Heights", "MI"),
    ("Coral Springs", "FL"), ("Waco", "TX"), ("Hartford", "CT"), ("Denton", "TX"),
    ("Provo", "UT"), ("Concord", "CA"), ("Murfreesboro", "TN"),
    ("New Haven", "CT"), ("Palm Coast", "FL"), ("Meridian", "ID"), ("Lakewood", "CO"),
    ("Lansing", "MI"), ("Clearwater", "FL"), ("Allen", "TX"), ("West Jordan", "UT"),
    ("Evansville", "IN"), ("Beaumont", "TX"), ("Wilmington", "NC"), ("West Valley City", "UT"),
    ("Round Rock", "TX"), ("Columbia", "MO"), ("Fargo", "ND"), ("Charleston", "SC"),
    ("Topeka", "KS"), ("Broken Arrow", "OK"), ("Gainesville", "FL"), ("Tuscaloosa", "AL"),
    ("Cedar Rapids", "IA"), ("Visalia", "CA"), ("Stamford", "CT"), ("Westminster", "CO"),
    ("Hillsboro", "OR"), ("Pueblo", "CO"), ("Arvada", "CO"), ("Green Bay", "WI"),
    ("Centennial", "CO"), ("Vallejo", "CA"), ("Elgin", "IL"),
]

# Care types
CARE_TYPES = [
    ("Nursing Home (Private Room)", "nursing-home", "A nursing home provides 24-hour skilled nursing care in a private room setting. Residents receive medical supervision, medication management, rehabilitation services, and assistance with all activities of daily living. This is the highest level of care outside a hospital.", 9541, "24/7 skilled nursing, medication management, physical/occupational therapy, meals, housekeeping, personal care assistance, social activities, emergency medical response", "Seniors with complex medical needs requiring continuous skilled nursing supervision, those recovering from surgery or serious illness, individuals with advanced dementia or Alzheimer's who need round-the-clock care"),
    ("Assisted Living", "assisted-living", "Assisted living facilities offer housing, meals, and personal care assistance for seniors who need help with daily activities but do not require the intensive medical care of a nursing home. Many facilities provide memory care units and social programming.", 4500, "Private or shared apartment, meals, medication reminders, housekeeping, transportation, social activities, personal care assistance, emergency call systems", "Seniors who need help with activities of daily living such as bathing, dressing, and medication management, but do not require 24-hour nursing care"),
    ("Home Health Aide", "home-health-aide", "A home health aide provides personal care services in the senior's own home. Services include assistance with bathing, dressing, meal preparation, light housekeeping, and companionship. This allows seniors to age in place while receiving needed support.", 26, "Personal care (bathing, dressing, grooming), meal preparation, light housekeeping, medication reminders, companionship, transportation to appointments, mobility assistance", "Seniors who prefer to stay in their own home but need regular assistance with personal care tasks and daily activities"),
    ("Adult Day Care", "adult-day-care", "Adult day care centers provide structured programs during daytime hours for seniors who need supervision or socialization. Services typically include meals, activities, health monitoring, and therapeutic services in a safe group environment.", 1690, "Structured daily activities, meals and snacks, health monitoring, physical therapy, social activities, transportation, personal care assistance during program hours", "Seniors who live with family caregivers and need daytime supervision and socialization, especially those with early to moderate dementia or physical limitations"),
    ("Homemaker Services", "homemaker-services", "Homemaker services help seniors maintain their homes and daily routines without personal hands-on care. Services include meal preparation, grocery shopping, housekeeping, laundry, errand running, and companionship.", 24, "Meal preparation, grocery shopping, housekeeping, laundry, errand running, companionship, medication reminders, transportation, light home maintenance coordination", "Seniors who are generally independent but need help with household tasks to safely remain in their homes"),
]


def slugify(name):
    """Convert city/state name to URL slug."""
    return name.lower().replace(' ', '-').replace('.', '').replace("'", '').replace(',', '')


def get_state_data(abbr):
    """Get state row by abbreviation."""
    for s in STATES_RAW:
        if s[1] == abbr:
            return s
    return None


def build_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # --- Create tables ---
    c.execute('''CREATE TABLE states (
        state TEXT PRIMARY KEY,
        abbr TEXT UNIQUE,
        slug TEXT UNIQUE,
        nursing_home_private INTEGER,
        nursing_home_semi INTEGER,
        assisted_living INTEGER,
        home_health_aide_hourly REAL,
        home_health_aide_monthly INTEGER,
        adult_day_care INTEGER,
        homemaker_services_hourly REAL,
        homemaker_services_monthly INTEGER,
        median_household_income INTEGER,
        senior_population_pct REAL,
        medicaid_coverage_notes TEXT
    )''')

    c.execute('''CREATE TABLE cities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city_name TEXT,
        state_abbr TEXT,
        slug TEXT UNIQUE,
        nursing_home_private INTEGER,
        assisted_living INTEGER,
        home_health_aide_hourly REAL,
        adult_day_care INTEGER,
        FOREIGN KEY (state_abbr) REFERENCES states(abbr)
    )''')

    c.execute('''CREATE TABLE care_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        slug TEXT UNIQUE,
        description TEXT,
        avg_national_cost REAL,
        what_included TEXT,
        who_needs_it TEXT
    )''')

    c.execute('''CREATE TABLE comparisons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug_a TEXT,
        slug_b TEXT,
        state_a TEXT,
        state_b TEXT,
        popularity_score INTEGER,
        UNIQUE(slug_a, slug_b)
    )''')

    # --- Insert states ---
    for row in STATES_RAW:
        state, abbr, np, ns, al, hha_h, adc, hm_h, income, senior_pct, med_notes = row
        hha_monthly = int(hha_h * 8 * 22)  # 8 hours/day, 22 days/month
        hm_monthly = int(hm_h * 8 * 22)
        slug = slugify(state)
        c.execute('''INSERT INTO states VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                  (state, abbr, slug, np, ns, al, hha_h, hha_monthly, adc, hm_h, hm_monthly, income, senior_pct, med_notes))

    # --- Insert cities ---
    random.seed(42)  # Reproducible
    seen_slugs = set()
    for city_name, state_abbr in CITIES_RAW:
        state_data = get_state_data(state_abbr)
        if not state_data:
            # DC special case
            if state_abbr == "DC":
                np_base, al_base, hha_base, adc_base = 11500, 5250, 28.00, 2100
            else:
                continue
        else:
            np_base = state_data[2]
            al_base = state_data[4]
            hha_base = state_data[5]
            adc_base = state_data[6]

        # City variation: ±20% from state average
        variation = random.uniform(-0.20, 0.20)
        np_city = int(np_base * (1 + variation))
        al_city = int(al_base * (1 + variation * 0.8))
        hha_city = round(hha_base * (1 + variation * 0.7), 2)
        adc_city = int(adc_base * (1 + variation * 0.6))

        slug = slugify(f"{city_name} {state_abbr}")
        if slug in seen_slugs:
            slug = slugify(f"{city_name} {state_abbr} metro")
        seen_slugs.add(slug)

        c.execute('''INSERT INTO cities (city_name, state_abbr, slug, nursing_home_private, assisted_living, home_health_aide_hourly, adult_day_care)
                     VALUES (?, ?, ?, ?, ?, ?, ?)''',
                  (city_name, state_abbr, slug, np_city, al_city, hha_city, adc_city))

    # --- Insert care types ---
    for name, slug, desc, avg_cost, what_incl, who_needs in CARE_TYPES:
        c.execute('''INSERT INTO care_types (name, slug, description, avg_national_cost, what_included, who_needs_it)
                     VALUES (?, ?, ?, ?, ?, ?)''',
                  (name, slug, desc, avg_cost, what_incl, who_needs))

    # --- Build comparisons (top state pairs) ---
    # Popular comparison pairs based on retirement destination popularity
    popular_states = [
        "florida", "arizona", "texas", "california", "new-york", "pennsylvania",
        "north-carolina", "georgia", "ohio", "michigan", "illinois", "virginia",
        "colorado", "washington", "oregon", "tennessee", "south-carolina",
        "nevada", "maryland", "massachusetts", "new-jersey", "connecticut",
        "minnesota", "wisconsin", "indiana", "alabama", "louisiana", "missouri",
    ]

    comparison_id = 0
    comparisons_added = set()
    for i, sa in enumerate(popular_states):
        for j, sb in enumerate(popular_states):
            if i >= j:
                continue
            key = (sa, sb)
            if key in comparisons_added:
                continue
            comparisons_added.add(key)

            # Get full state names
            state_a_name = sa.replace('-', ' ').title()
            state_b_name = sb.replace('-', ' ').title()
            # Popularity based on position in list
            pop_score = max(1000 - (i * 20 + j * 10), 100)

            c.execute('''INSERT INTO comparisons (slug_a, slug_b, state_a, state_b, popularity_score)
                         VALUES (?, ?, ?, ?, ?)''',
                      (sa, sb, state_a_name, state_b_name, pop_score))

    # Create indexes
    c.execute('CREATE INDEX idx_cities_state ON cities(state_abbr)')
    c.execute('CREATE INDEX idx_cities_slug ON cities(slug)')
    c.execute('CREATE INDEX idx_comparisons_slugs ON comparisons(slug_a, slug_b)')
    c.execute('CREATE INDEX idx_comparisons_pop ON comparisons(popularity_score DESC)')

    conn.commit()

    # Print stats
    state_count = c.execute('SELECT COUNT(*) FROM states').fetchone()[0]
    city_count = c.execute('SELECT COUNT(*) FROM cities').fetchone()[0]
    care_count = c.execute('SELECT COUNT(*) FROM care_types').fetchone()[0]
    comp_count = c.execute('SELECT COUNT(*) FROM comparisons').fetchone()[0]

    print(f"Database built: {DB_PATH}")
    print(f"  States: {state_count}")
    print(f"  Cities: {city_count}")
    print(f"  Care types: {care_count}")
    print(f"  Comparisons: {comp_count}")

    conn.close()


if __name__ == '__main__':
    build_db()
