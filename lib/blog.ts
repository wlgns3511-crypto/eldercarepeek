export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  readingTime: number;
  content: string;
}

const posts: BlogPost[] = [
  {
    slug: "assisted-living-vs-nursing-home",
    title: "Assisted Living vs. Nursing Home: Which Is Right for Your Parent?",
    description:
      "Understanding the difference between assisted living and nursing homes can help you choose the right level of care for your parent — and avoid paying for more than they need.",
    publishedAt: "2024-10-15",
    updatedAt: "2025-01-10",
    category: "Care Options",
    readingTime: 7,
    content: `
<h2>The Core Difference: Medical Need</h2>
<p>The fundamental distinction between assisted living and nursing homes comes down to the level of medical care required. <strong>Assisted living</strong> is for people who need help with daily activities but are relatively stable medically. <strong>Nursing homes</strong> are for those who need continuous skilled nursing or medical supervision.</p>

<h2>Assisted Living: Independence with Support</h2>
<p>Assisted living communities provide help with Activities of Daily Living (ADLs) — bathing, dressing, grooming, medication management, and meals — while allowing residents to maintain as much independence as possible. Most facilities feature:</p>
<ul>
  <li>Private or semi-private apartments or rooms</li>
  <li>Communal dining, activities, and social programs</li>
  <li>Staff available 24/7, but not necessarily RNs on-site at all times</li>
  <li>Transportation services</li>
</ul>
<p><strong>Average cost: $4,000–$5,500/month</strong> nationally in 2024, though this varies widely by location and amenities. Most assisted living is paid privately; Medicaid covers it in some states but not all.</p>

<h2>Nursing Homes: Skilled Medical Care</h2>
<p>Nursing homes (also called skilled nursing facilities or SNFs) provide 24-hour nursing care and medical supervision. They're appropriate for people who:</p>
<ul>
  <li>Need wound care, IV medications, or physical/occupational therapy</li>
  <li>Are recovering from a hospital stay (short-term rehabilitation)</li>
  <li>Have complex medical conditions requiring continuous monitoring</li>
  <li>Can no longer be safely managed in a less intensive setting</li>
</ul>
<p><strong>Average cost: $8,000–$9,500/month</strong> for a semi-private room in 2024. Medicare covers short-term stays (up to 100 days after a qualifying hospital stay); Medicaid covers long-term stays for those who qualify.</p>

<h2>Memory Care: A Specialized Option</h2>
<p>Memory care units are specialized programs within assisted living or standalone communities designed for people with Alzheimer's disease or other dementias. Key features include:</p>
<ul>
  <li>Secured environments to prevent wandering</li>
  <li>Staff specially trained in dementia care</li>
  <li>Programming designed for cognitive engagement</li>
  <li>Higher staff-to-resident ratios</li>
</ul>
<p>Memory care typically costs $1,000–$2,000/month more than standard assisted living.</p>

<h2>Continuing Care Retirement Communities (CCRCs)</h2>
<p>CCRCs (also called Life Plan Communities) offer all levels of care on one campus — independent living, assisted living, memory care, and skilled nursing. Residents can transition between levels as needs change without moving to a different facility. They typically require a substantial entrance fee ($100,000–$500,000+) plus monthly fees ($3,000–$6,000+).</p>

<h2>How to Choose the Right Level</h2>
<p>Consider these factors when evaluating options:</p>
<ul>
  <li><strong>Medical needs</strong>: Does your parent need skilled nursing care? If yes, nursing home or CCRC SNF unit.</li>
  <li><strong>Cognitive status</strong>: Significant dementia with behavioral symptoms? Memory care may be needed.</li>
  <li><strong>Social needs</strong>: Someone who values independence and social connection may thrive in assisted living.</li>
  <li><strong>Financial resources</strong>: Medicaid availability differs dramatically by care type and state.</li>
  <li><strong>Trajectory</strong>: Is the condition stable, or likely to progress? A CCRC may prevent future moves.</li>
</ul>

<h2>A Note on Transitions</h2>
<p>Many families start with assisted living and transition to a nursing home if needs increase. This can be emotionally and logistically difficult. If there's any possibility your parent may need skilled nursing within 2–3 years, it's worth exploring CCRCs or nursing homes with assisted living wings now, rather than facing a crisis-driven move later.</p>
`,
  },
  {
    slug: "how-to-pay-for-senior-care",
    title: "How to Pay for Senior Care: Medicaid, Veterans Benefits, and More",
    description:
      "Senior care costs can reach $100,000 per year. Here are the funding sources available — from Medicaid to VA benefits to life insurance conversions — and how to qualify for each.",
    publishedAt: "2024-10-22",
    category: "Senior Finance",
    readingTime: 8,
    content: `
<h2>The Cost Reality</h2>
<p>Senior care costs can be staggering. Nursing home care averages $8,500–$9,500/month, assisted living $4,000–$5,500/month, and even in-home care can run $5,000–$8,000/month for full-time help. Planning for these costs — ideally years in advance — is essential.</p>

<h2>Medicare: Short-Term Only</h2>
<p>Many families are surprised to learn that <strong>Medicare does not cover long-term custodial care</strong>. Medicare Part A covers skilled nursing facility care only after a qualifying hospital stay of 3+ days, and only for up to 100 days. Days 1–20 are fully covered; days 21–100 require a $204/day copay in 2024; after day 100, Medicare pays nothing. For rehabilitation after a hospital stay, Medicare is valuable — but it's not a long-term care solution.</p>

<h2>Medicaid: The Primary Long-Term Care Payer</h2>
<p>Medicaid is the primary payer for long-term nursing home care in the US, covering about 62% of all nursing home residents. To qualify, you must meet income and asset limits, which vary by state. Typically:</p>
<ul>
  <li>Income limit: ~$2,829/month (2024) for most states</li>
  <li>Asset limit: ~$2,000 in countable assets (home, car, and some other items are often exempt)</li>
</ul>
<p>The "spend-down" process — depleting savings until you reach Medicaid eligibility — is how many middle-class families end up on Medicaid. Medicaid planning with an elder law attorney can help protect some assets through legal strategies like spousal protections and irrevocable trusts (with 5-year look-back rules).</p>

<h2>Long-Term Care Insurance</h2>
<p>Long-term care (LTC) insurance pays a daily or monthly benefit for covered care. The ideal time to buy is ages 50–65 — premiums are lower, and you're more likely to qualify medically. Average annual premiums run $2,000–$4,000 for a 55-year-old couple. Look for policies with inflation protection (3–5% compound growth) and a solid financial rating on the insurer.</p>
<p>Traditional LTC insurance has become expensive and hard to find. <strong>Hybrid life/LTC policies</strong> are increasingly popular — they combine life insurance with LTC benefits, so if you don't use the LTC benefits, your heirs receive the death benefit.</p>

<h2>VA Aid &amp; Attendance Benefit</h2>
<p>Veterans who served at least 90 days of active duty (with at least one day during a wartime period) and their surviving spouses may qualify for the <strong>VA Aid &amp; Attendance benefit</strong> — a non-service-connected pension that can help pay for in-home care, assisted living, or nursing home care. Maximum monthly benefits in 2024:</p>
<ul>
  <li>Veteran with a spouse: up to $2,642/month</li>
  <li>Single veteran: up to $2,229/month</li>
  <li>Surviving spouse: up to $1,432/month</li>
</ul>
<p>Eligibility requires meeting income and net worth limits. The application process can take months — apply early through the VA or an accredited VA claims agent.</p>

<h2>Reverse Mortgage</h2>
<p>Homeowners aged 62+ can access home equity through a Home Equity Conversion Mortgage (HECM). The reverse mortgage pays a lump sum, monthly payments, or a line of credit — with no repayment required until the homeowner moves out permanently or passes away. This strategy works best for those who want to age in place and have significant home equity, as the costs (origination fees, MIP, interest) are substantial.</p>

<h2>Life Insurance Conversion</h2>
<p>Existing life insurance policies can be converted into long-term care benefits through:</p>
<ul>
  <li><strong>Life settlement</strong>: Sell the policy to a third party for more than cash surrender value</li>
  <li><strong>Accelerated death benefits</strong>: Some policies allow tax-free access to the death benefit for terminal or chronic illness</li>
  <li><strong>1035 exchange</strong>: Convert a life policy into a hybrid LTC/life annuity tax-free</li>
</ul>

<h2>Family Contributions and "Caregiver Agreements"</h2>
<p>Adult children often contribute financially to senior care costs. Some families use formal "caregiver agreements" where adult children are paid for providing care — this can reduce assets legally while compensating family caregivers fairly. These agreements should be drafted by an elder law attorney to withstand Medicaid scrutiny.</p>
`,
  },
  {
    slug: "signs-parent-needs-memory-care",
    title: "10 Signs Your Parent May Need Memory Care",
    description:
      "Memory care is specialized, secured care for people with Alzheimer's and other dementias. These 10 warning signs suggest it may be time to consider making the transition.",
    publishedAt: "2024-11-05",
    category: "Caregiver Guides",
    readingTime: 6,
    content: `
<h2>When Assisted Living Isn't Enough</h2>
<p>Standard assisted living is wonderful for seniors who need help with daily tasks but remain cognitively stable. When dementia progresses, however, the needs become more complex — and the safety risks increase significantly. Memory care communities are purpose-built to meet those needs.</p>

<h2>10 Signs It May Be Time</h2>
<h3>1. Getting Lost in Familiar Places</h3>
<p>If your parent gets lost driving to the grocery store they've visited for years, or can't find their way back to their room in their current facility, this is a significant safety concern. Memory care communities have secured environments that prevent dangerous wandering.</p>

<h3>2. Forgetting Recent Events Repeatedly</h3>
<p>Everyone forgets occasionally. But when your parent tells you the same story four times in a 30-minute conversation, or has no memory of a major family event from last week, this suggests the kind of short-term memory loss characteristic of Alzheimer's disease.</p>

<h3>3. Personality and Behavioral Changes</h3>
<p>Dementia often causes significant personality changes — increased agitation, suspicion (accusing caregivers of stealing), aggression, depression, or a complete reversal of previous personality traits. These behavioral symptoms can be extremely challenging for family caregivers and may require specialized dementia care training to manage safely.</p>

<h3>4. Unsafe Behavior at Home</h3>
<p>Leaving the stove on, forgetting medications (or double-dosing), flooding the bathroom, or letting strangers into the home all signal that the person can no longer manage basic safety. These behaviors require a supervised environment.</p>

<h3>5. Wandering Risk</h3>
<p>About 60% of people with dementia will wander at some point. If your parent has wandered, attempted to wander, or shows signs of wanting to "go home" (even when they are home), a memory care community's secure design becomes critical for safety.</p>

<h3>6. Caregiver Burnout</h3>
<p>This sign is about you, not just your parent. If you or another family caregiver is exhausted, resentful, depressed, or neglecting your own health to provide care, it's a sign the care needs have exceeded what family can reasonably provide. Caregiver burnout can lead to neglect — recognizing it early is crucial.</p>

<h3>7. Sundowning Symptoms</h3>
<p>Sundowning — increased confusion, agitation, and behavioral problems in the late afternoon and evening — is common in moderate-to-advanced Alzheimer's. Managing sundowning safely often requires structured routines and trained staff around the clock.</p>

<h3>8. Incontinence Becoming Unmanageable</h3>
<p>While incontinence alone doesn't require memory care, combined with cognitive impairment it creates hygiene and dignity challenges that family caregivers often struggle to manage. Memory care staff are trained in compassionate incontinence care.</p>

<h3>9. Significant Weight Loss or Self-Neglect</h3>
<p>If your parent is forgetting to eat, losing significant weight, or neglecting basic hygiene (not bathing, wearing the same clothes for days), the dementia has progressed to a point where daily supervision is needed.</p>

<h3>10. Unable to Follow Safety Instructions</h3>
<p>If your parent cannot understand or follow basic safety instructions — "don't answer the door for strangers," "call me before you drive" — their judgment is impaired in ways that create serious risks at home or in a standard assisted living setting.</p>

<h2>How to Have the Conversation</h2>
<p>Talking about memory care with your parent is one of the hardest conversations a family can have. Approach it from a place of love and safety: "I want you to be safe and comfortable. There are communities with people who specialize in helping people like you." Include your parent's doctor in the conversation — a clinical assessment and recommendation from a trusted physician often carries more weight than family concerns alone.</p>

<h2>Visiting Memory Care Communities</h2>
<p>When evaluating memory care options, watch for: staff interactions with residents (warm and patient vs. rushed?), activity programming (meaningful engagement vs. just TV?), and whether the environment feels calm and homelike or institutional. Ask about staff turnover and the training requirements for dementia care.</p>
`,
  },
  {
    slug: "senior-care-costs-by-city-2024",
    title: "Senior Care Costs by City 2024: What You'll Really Pay",
    description:
      "Senior care costs vary by as much as 3x between the most expensive and most affordable US cities. Here's what you'll actually pay in major markets.",
    publishedAt: "2024-11-20",
    category: "Cost Data",
    readingTime: 5,
    content: `
<h2>Why Location Matters So Much</h2>
<p>Senior care costs are driven by local labor markets, real estate costs, and state regulations. A nursing home in rural Mississippi might cost $5,500/month; the same level of care in San Francisco can run $15,000+/month. Understanding the geographic variation helps families plan — and sometimes move — strategically.</p>

<h2>Most Expensive Cities for Senior Care</h2>
<h3>New York City</h3>
<p>NYC has some of the highest senior care costs in the nation. A private room in a Manhattan nursing home often exceeds $15,000/month. Assisted living in good neighborhoods runs $7,000–$12,000/month. Home health aides command $30–$40/hour, making 24-hour home care more expensive than facility care.</p>

<h3>San Francisco Bay Area</h3>
<p>The Bay Area consistently ranks among the most expensive for all senior care types. Nursing homes average $12,000–$15,000/month for a private room. Assisted living communities in upscale neighborhoods like Marin County or Palo Alto can exceed $10,000/month. Home health aides average $35–$45/hour.</p>

<h3>Washington, DC Metro</h3>
<p>The DC metro area — including Northern Virginia and Montgomery County, MD — ranks among the most expensive markets. Nursing home costs run $9,000–$13,000/month; assisted living $4,500–$8,000/month. High costs reflect the area's high cost of living and labor market competition.</p>

<h2>Most Affordable Cities for Senior Care</h2>
<h3>Rural South and Midwest</h3>
<p>Cities like Tulsa, OK; Jackson, MS; and Wichita, KS consistently offer the most affordable senior care. Nursing home care can run as low as $5,000–$6,000/month for a semi-private room. Assisted living averages $2,500–$3,500/month. Home health aides may cost $15–$20/hour.</p>

<h3>Specific Affordable Markets</h3>
<ul>
  <li><strong>Memphis, TN</strong>: Nursing home ~$5,800/month; assisted living ~$3,000/month</li>
  <li><strong>Oklahoma City, OK</strong>: Nursing home ~$5,500/month; assisted living ~$2,800/month</li>
  <li><strong>Wichita, KS</strong>: Nursing home ~$5,200/month; assisted living ~$2,600/month</li>
</ul>

<h2>Home Health Aide vs. Facility Cost Gap</h2>
<p>In most markets, 24/7 home health aide coverage is <strong>more expensive</strong> than facility care. At $20/hour, round-the-clock care costs $14,400/month — more than nursing home rates in many markets. However, part-time home health (20–40 hours/week) is often more affordable than any facility option, making it the first choice for families who can supplement with unpaid family care.</p>

<h2>Medicaid Rate vs. Private Pay</h2>
<p>Medicaid pays facilities a fixed reimbursement rate — often 20–40% below what private-pay residents are charged. This creates a meaningful difference: in California, a nursing home might charge private-pay residents $11,000/month but receive $7,500/month from Medicaid for the same room. Some facilities limit their Medicaid beds; others are majority Medicaid. This affects both availability and, sometimes, quality of care.</p>

<h2>Using Cost Data to Plan</h2>
<p>If you're 10–20 years from likely needing senior care, today's costs — adjusted for 3–5% annual inflation — will be significantly higher when you need them. A nursing home that costs $9,000/month today will cost approximately $14,600–$19,600/month in 15 years at 3–5% annual increases. Planning for these escalating costs early gives your family options.</p>
`,
  },
  {
    slug: "choosing-senior-living-community",
    title: "How to Choose the Right Senior Living Community: 15-Point Checklist",
    description:
      "Choosing a senior living community is one of the most consequential decisions a family can make. Use this 15-point checklist to evaluate facilities before you commit.",
    publishedAt: "2024-12-10",
    category: "Caregiver Guides",
    readingTime: 8,
    content: `
<h2>Why This Decision Matters</h2>
<p>The quality of senior living communities varies enormously — from excellent facilities with engaged staff and rich programming to poor-quality facilities with high turnover and neglect. The difference matters enormously to your loved one's quality of life. This checklist will help you evaluate what you see beyond the marketing brochures.</p>

<h2>Before You Visit</h2>
<h3>1. Check Medicare's Nursing Home Compare</h3>
<p>For nursing homes, Medicare.gov's Care Compare tool shows star ratings (1–5) based on health inspections, staffing levels, and quality measures. Look at the individual components — a 5-star overall rating can mask a 2-star inspection rating. Download and read the most recent inspection report.</p>

<h3>2. Look Up State Inspection Reports</h3>
<p>Your state's health department maintains inspection records for all licensed facilities. Search for deficiency citations — some are minor (a missing temperature log), others are serious (falls, medication errors, abuse). A pattern of serious citations is a red flag.</p>

<h3>3. Check for Recent Ownership Changes</h3>
<p>Ownership changes in senior care can dramatically affect quality. New owners may cut staff, defer maintenance, or change the culture. Search the facility name and look for news coverage of ownership transfers or management changes in the past 2 years.</p>

<h2>During Your Visit</h2>
<h3>4. Visit at Different Times</h3>
<p>Visit once during a scheduled tour, then return unannounced at mealtimes (typically 7–8 AM, noon, and 5–6 PM) and on a weekend. The true character of a facility shows up in routine moments, not in prepared presentations.</p>

<h3>5. Observe the Smell Test</h3>
<p>A facility should not smell like urine or feces throughout the common areas. Some odor in individual rooms can happen even in good facilities, but pervasive odors in hallways and common areas indicate staffing problems or systemic care issues.</p>

<h3>6. Watch Staff-Resident Interactions</h3>
<p>Are staff making eye contact with residents, calling them by name, speaking kindly? Or do they talk past residents and rush through tasks? The warmth (or lack thereof) in routine interactions tells you a great deal about the culture.</p>

<h3>7. Ask About Staff Turnover Rate</h3>
<p>Ask the administrator directly: "What is your annual staff turnover rate for CNAs?" The national average is 65%+. Facilities with turnover under 30–40% typically have better culture and continuity of care. High turnover means residents constantly interact with unfamiliar staff.</p>

<h3>8. Attend a Group Activity</h3>
<p>Are residents engaged, or are most people in their rooms or sitting in front of a TV? Quality facilities run meaningful activities — exercise classes, art therapy, music programs, volunteer visitors — not just bingo. Look at the activity calendar for variety.</p>

<h3>9. Talk to Current Residents and Families</h3>
<p>Ask to speak informally with residents or family members visiting that day. Ask: "What do you wish you'd known before choosing this place?" and "What could be better?" Candid feedback from people with skin in the game is invaluable.</p>

<h3>10. Sample the Food</h3>
<p>Many facilities will let you try a meal during your visit. Food quality significantly affects quality of life. Are residents eating — or avoiding the dining room? Malnutrition and weight loss are common problems in poor-quality facilities.</p>

<h2>Review the Contract</h2>
<h3>11. Read the Discharge Policy</h3>
<p>Under what conditions can the facility ask your parent to leave? Look for clauses about Medicaid conversion (some private-pay facilities discharge residents when they transition to Medicaid), behavioral issues, or care needs that exceed the facility's capacity. Understand your rights before you sign.</p>

<h3>12. Check for Arbitration Clauses</h3>
<p>Many nursing home contracts include mandatory arbitration clauses that prevent families from suing in court if abuse or neglect occurs. As of 2024, CMS has restricted these clauses for nursing homes — but review any contract carefully and consult an attorney if you see arbitration language.</p>

<h3>13. Understand Rate Increase History</h3>
<p>Ask for the last 3 years of rate increase history. Annual increases of 5–8% are typical; increases of 10–15% suggest financial instability or aggressive management. Understand what triggers additional charges beyond the base rate.</p>

<h2>After Your Visit</h2>
<h3>14. Compare Your Notes Systematically</h3>
<p>After visiting 3–5 facilities, it's easy to blend them together. Take notes during each visit using a consistent checklist. Compare your notes side by side with cost, inspection ratings, and your gut impression.</p>

<h3>15. Trust Your Gut</h3>
<p>After all the data review, your instinct matters. If something felt off — if staff seemed resentful, if residents seemed sad, if the administrator was evasive — trust that reaction. You're entrusting someone you love to these people.</p>
`,
  },
];

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(posts.map((p) => p.category)));
}
