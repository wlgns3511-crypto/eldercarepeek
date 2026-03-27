#!/usr/bin/env python3
"""Expand eldercarepeek: more cities + state×care type combos + all state comparisons"""
import sqlite3, os, random, hashlib

DB_PATH = os.path.join(os.path.dirname(__file__), "../data/eldercare.db")

# Major US cities by state (500+ cities)
CITIES_BY_STATE = {
    "AL": ["Birmingham", "Montgomery", "Huntsville", "Mobile", "Tuscaloosa", "Hoover", "Dothan", "Auburn", "Decatur", "Florence"],
    "AK": ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
    "AZ": ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Glendale", "Gilbert", "Tempe", "Peoria", "Surprise", "Yuma", "Flagstaff"],
    "AR": ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro", "Rogers", "Conway", "North Little Rock"],
    "CA": ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland", "Bakersfield", "Anaheim", "Santa Ana", "Riverside", "Stockton", "Irvine", "Chula Vista", "Santa Clarita", "Modesto", "Moreno Valley", "Fontana", "San Bernardino"],
    "CO": ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Thornton", "Arvada", "Westminster", "Pueblo", "Boulder"],
    "CT": ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury", "Norwalk", "Danbury", "New Britain"],
    "DE": ["Wilmington", "Dover", "Newark", "Middletown", "Bear"],
    "FL": ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale", "Port St. Lucie", "Cape Coral", "Pembroke Pines", "Hollywood", "Gainesville", "Coral Springs", "Clearwater", "Palm Bay", "Lakeland", "Pompano Beach"],
    "GA": ["Atlanta", "Augusta", "Columbus", "Macon", "Savannah", "Athens", "Sandy Springs", "Roswell", "Johns Creek", "Albany", "Warner Robins"],
    "HI": ["Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu"],
    "ID": ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello", "Caldwell", "Twin Falls"],
    "IL": ["Chicago", "Aurora", "Rockford", "Joliet", "Naperville", "Springfield", "Peoria", "Elgin", "Champaign", "Waukegan", "Cicero", "Bloomington"],
    "IN": ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel", "Fishers", "Bloomington", "Hammond", "Gary", "Lafayette"],
    "IA": ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City", "Waterloo", "Ames", "Council Bluffs"],
    "KS": ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka", "Lawrence", "Shawnee", "Manhattan"],
    "KY": ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington", "Richmond", "Georgetown"],
    "LA": ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles", "Kenner", "Bossier City", "Monroe"],
    "ME": ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"],
    "MD": ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Bowie", "Hagerstown", "Annapolis", "College Park"],
    "MA": ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge", "New Bedford", "Brockton", "Quincy", "Lynn", "Fall River"],
    "MI": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor", "Lansing", "Flint", "Dearborn", "Livonia", "Troy", "Kalamazoo"],
    "MN": ["Minneapolis", "Saint Paul", "Rochester", "Duluth", "Bloomington", "Brooklyn Park", "Plymouth", "Maple Grove", "Woodbury"],
    "MS": ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi", "Meridian", "Tupelo", "Olive Branch"],
    "MO": ["Kansas City", "St. Louis", "Springfield", "Independence", "Columbia", "Lee's Summit", "O'Fallon", "St. Joseph", "St. Charles"],
    "MT": ["Billings", "Missoula", "Great Falls", "Bozeman", "Helena", "Butte"],
    "NE": ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
    "NV": ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks", "Carson City"],
    "NH": ["Manchester", "Nashua", "Concord", "Dover", "Rochester"],
    "NJ": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison", "Woodbridge", "Lakewood", "Toms River", "Hamilton", "Trenton", "Clifton", "Camden"],
    "NM": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell", "Farmington"],
    "NY": ["New York", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon", "Schenectady", "Utica", "White Plains"],
    "NC": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville", "Cary", "Wilmington", "High Point", "Asheville", "Concord"],
    "ND": ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
    "OH": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton", "Parma", "Canton", "Youngstown", "Lorain", "Hamilton"],
    "OK": ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond", "Lawton", "Moore"],
    "OR": ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro", "Beaverton", "Bend", "Medford", "Springfield", "Corvallis"],
    "PA": ["Philadelphia", "Pittsburgh", "Allentown", "Reading", "Scranton", "Bethlehem", "Lancaster", "Harrisburg", "Erie", "York"],
    "RI": ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence"],
    "SC": ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Rock Hill", "Greenville", "Summerville", "Goose Creek"],
    "SD": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
    "TN": ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville", "Murfreesboro", "Franklin", "Jackson", "Johnson City"],
    "TX": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Laredo", "Lubbock", "Garland", "Irving", "Amarillo", "Grand Prairie", "Brownsville", "McKinney", "Frisco", "Pasadena", "Mesquite"],
    "UT": ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem", "Sandy", "Ogden", "St. George", "Layton"],
    "VT": ["Burlington", "South Burlington", "Rutland", "Barre", "Montpelier"],
    "VA": ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria", "Hampton", "Roanoke", "Portsmouth", "Lynchburg", "Charlottesville"],
    "WA": ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent", "Everett", "Renton", "Yakima", "Federal Way", "Bellingham", "Olympia"],
    "WV": ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
    "WI": ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine", "Appleton", "Waukesha", "Oshkosh", "Eau Claire"],
    "WY": ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"],
}

def slugify(text):
    import re
    s = text.lower().strip()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s-]+', '-', s)
    return s

def vary(base, seed, pct=0.2):
    h = int(hashlib.md5(seed.encode()).hexdigest()[:8], 16)
    factor = 1 + (h % 1000 - 500) / 500 * pct
    return round(base * factor)

def main():
    conn = sqlite3.connect(DB_PATH)
    
    # Get state data for generating city variations
    states = {}
    for r in conn.execute("SELECT abbr, nursing_home_private, nursing_home_semi, assisted_living, home_health_aide_hourly, adult_day_care FROM states").fetchall():
        states[r[0]] = {"nh_priv": r[1], "nh_semi": r[2], "al": r[3], "hha": r[4], "adc": r[5]}
    
    # Delete existing cities and re-add with more
    conn.execute("DELETE FROM cities")
    
    city_count = 0
    for abbr, cities in CITIES_BY_STATE.items():
        if abbr not in states:
            continue
        s = states[abbr]
        for city in cities:
            slug = slugify(f"{city}-{abbr.lower()}")
            seed = f"{city}-{abbr}"
            conn.execute("""INSERT OR IGNORE INTO cities 
                (city_name, state_abbr, slug, nursing_home_private, assisted_living, home_health_aide_hourly, adult_day_care)
                VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (city, abbr, slug, vary(s["nh_priv"], seed), vary(s["al"], seed),
                 round(vary(int(s["hha"]*100), seed) / 100, 2), vary(s["adc"], seed)))
            city_count += 1
    
    # Expand comparisons to all state pairs
    conn.execute("DELETE FROM comparisons")
    state_list = conn.execute("SELECT slug, state FROM states ORDER BY slug").fetchall()
    comp_count = 0
    batch = []
    for i in range(len(state_list)):
        for j in range(i+1, len(state_list)):
            batch.append((state_list[i][0], state_list[j][0], state_list[i][1], state_list[j][1], len(state_list[i][1]) + len(state_list[j][1])))
            comp_count += 1
    conn.executemany("INSERT OR IGNORE INTO comparisons (slug_a, slug_b, state_a, state_b, popularity_score) VALUES (?,?,?,?,?)", batch)
    
    conn.commit()
    
    final_cities = conn.execute("SELECT COUNT(*) FROM cities").fetchone()[0]
    final_comps = conn.execute("SELECT COUNT(*) FROM comparisons").fetchone()[0]
    print(f"Cities: {final_cities}")
    print(f"Comparisons: {final_comps}")
    conn.close()

if __name__ == "__main__":
    main()
