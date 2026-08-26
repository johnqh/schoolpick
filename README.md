# SchoolPick

SchoolPick helps parents choose a school that works for their child, their commute, and the actual application process.

The product starts with an address, grade, preferred leaving time, max commute, and family priorities. It finds eligible public-school options and nearby private schools, checks whether each school works with the morning schedule, scores each school against the parent's priorities using cited public sources, then turns the final preference list into an actionable application plan.

## Hackathon Concept

SchoolPick is designed for the Convex ALLGAS Hackathon as a consumer-oriented, full-stack app that can be demoed end to end with real public data.

The core value is not just ranking schools. It is helping a parent move from "what schools should I consider?" to "what do I do next?" with clear `Do it` actions for public and private school applications.

## User Flow

1. Parent enters a home address.
2. Parent selects the child's grade.
3. Parent enters a preferred leaving time and max acceptable commute.
4. Parent chooses priority factors such as academics, commute, after-school care, language immersion, arts, STEM, support services, and school size.
5. SchoolPick finds the school district for the address.
6. SchoolPick lists public schools in the district that serve the grade and nearby private schools that serve the grade.
7. SchoolPick calculates morning driving time from home to each school.
8. SchoolPick filters out schools where the commute does not fit the preferred leaving time and school start time.
9. SchoolPick crawls school websites and relevant review/information pages.
10. SchoolPick scores each school against the parent's selected factors with cited evidence.
11. Parent manually reorders the preference list.
12. Parent selects schools and clicks `Do it` actions to prepare applications, emails, and deadlines.

## Actionable Application Flows

For public schools:

- Build a ranked-choice list.
- Extract required documents.
- Prepare the application packet.
- Draft questions for the enrollment office.
- Generate a submission checklist for the district portal.
- Track deadlines, waitlist status, and assignment updates.

For private schools:

- Request a tour.
- Email admissions.
- Prepare school-specific application checklists.
- Draft parent statements.
- Track recommendations, assessment dates, interviews, and deadlines.
- Compare admissions replies.

## Suggested Parent Priority Factors

- Academics
- Commute fit
- Start and end time fit
- After-school care
- Language immersion
- Special education and learning support
- Arts and music
- STEM
- Sports and outdoor space
- School size
- Diversity and community
- Safety and belonging
- Tuition and financial aid
- Admissions odds
- Application complexity

## Demo Scope

The strongest MVP scope is San Francisco.

San Francisco works well because SFUSD publishes official school directories, start and end times, enrollment information, and ranked-choice application guidance. This lets the demo use real public-school data while keeping the first build focused.

The e2e demo can use:

- A San Francisco address.
- A selected grade such as kindergarten or 6th grade.
- SFUSD public schools for that grade.
- Nearby private schools from public data sources.
- Traffic-aware commute calculations.
- Crawled school pages for factor scoring.
- AgentMail demo inboxes for admissions/enrollment email flows.
- Convex real-time updates for rankings, todos, application status, and replies.

## Real Data Sources

- SFUSD school directory: https://www.sfusd.edu/schools/directory/table
- SFUSD school start and end times: https://www.sfusd.edu/schools/enroll/resources/school-start-and-end-times-2025-26
- SFUSD enrollment FAQ and ranked-choice process: https://www.sfusd.edu/schools/enroll/resources/frequently-asked-questions
- U.S. Census Geocoder school-district geography: https://www.census.gov/help/topics/faq.how-do-i-search-by-address-using-the-census-geocoder.html
- NCES Common Core of Data public schools: https://nces.ed.gov/ccd/
- NCES public school locations: https://nces.ed.gov/opengis/rest/services/K12_School_Locations/EDGE_GEOCODE_PUBLICSCH_2223/MapServer/0
- NCES Private School Universe Survey tools: https://nces.ed.gov/surveys/pss/datatools.asp
- Google Routes API route matrix: https://developers.google.com/maps/documentation/routes/compute_route_matrix

## Sponsor Integration Plan

Convex:

- Store users, searches, schools, sources, factor scores, rankings, todos, application plans, messages, and timeline events.
- Use Convex queries for live dashboards and shared family review.
- Use Convex mutations for ranking changes, todo status, school selection, and application updates.
- Use Convex actions/workflows for crawling, scoring, route calculations, and email processing.

Firecrawl:

- Crawl public school profile pages, district enrollment pages, private-school admissions pages, and relevant school review/information pages.
- Convert unstructured school websites into normalized source material for scoring and application steps.

OpenAI:

- Extract programs, admissions requirements, deadlines, tuition notes, and factor evidence from crawled pages.
- Score each school against parent-selected factors.
- Generate ranked-list explanations, parent questions, application checklists, and email drafts.
- Summarize inbound admissions/enrollment replies.

AgentMail:

- Create a per-family or per-application inbox.
- Send admissions/enrollment questions.
- Receive demo replies during judging.
- Convert replies into Convex timeline events and next-step todos.

## Important Product Caveat

SchoolPick should distinguish between:

- The school district attached to an address.
- Public schools available through district choice, lottery, transfer, charter, magnet, or attendance-boundary rules.
- A guaranteed assigned school, if the district provides one.

For the MVP, SchoolPick should say "eligible district and application options" unless it has district-specific data proving an assigned school.

## Why This Can Demo End To End

The judge can run the full flow without needing a real school to respond:

1. Enter a demo address and grade.
2. See schools loaded from public data.
3. See commute-aware filtering.
4. See factor scores backed by crawled sources.
5. Reorder the school preference list.
6. Click `Do it` to create an application checklist and email admissions/enrollment.
7. Use a demo AgentMail reply to trigger a live Convex status update.

The final application submission can remain a portal handoff, while all preparation, communication, tracking, and ranking are completed inside SchoolPick.
