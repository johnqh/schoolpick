# SchoolPick Product Spec

## Summary

SchoolPick is a parent-facing school search and application assistant. A parent enters a home address, grade, morning leaving preference, commute limit, and school priorities. SchoolPick finds public and private schools that could work, filters them by commute and bell time, scores them against the parent's priorities using cited public sources, lets the parent adjust the preference list, and turns selected schools into actionable application tasks.

The app is designed for an end-to-end hackathon demo with real public data, Convex as the backend, Firecrawl for school/application page ingestion, OpenAI for extraction and scoring, and AgentMail for admissions/enrollment communication.

## Product Positioning

Parents do not only need a school ranking. They need to know:

- Which schools are possible from their address and grade.
- Whether the morning routine works.
- Whether a school fits their child and family priorities.
- What each application requires.
- What to do next, in order.

SchoolPick's opinionated product promise:

> Find schools that fit your child and your morning, then get through the application process.

## Target User

Primary user: a parent or guardian choosing a school for a child.

Initial target scenario:

- Parent lives in San Francisco.
- Parent is applying for kindergarten, 6th grade, or 9th grade.
- Parent wants to compare SFUSD public options and nearby private schools.
- Parent has practical constraints, especially commute time, school start time, after-school care, and application deadlines.

Secondary users:

- Co-parent or guardian helping rank schools.
- Family member helping with research.
- Admissions/enrollment contact receiving generated questions.

## Core Demo Story

Demo parent:

- Address: a San Francisco home address.
- Grade: kindergarten or 6th grade.
- Preferred leaving time: 7:35 AM.
- Max commute: 25 minutes.
- Dropoff buffer: 10 minutes.
- Priorities: commute fit, after-school care, language immersion, academics, school size, and application simplicity.

Flow:

1. Parent enters search criteria.
2. SchoolPick finds the address's district and loads schools serving the selected grade.
3. SchoolPick calculates morning driving time from home to each school.
4. SchoolPick filters out schools where:

   `preferred leaving time + drive time + dropoff buffer > school start time`

5. SchoolPick crawls school and district pages.
6. SchoolPick scores each school on selected factors with evidence.
7. Parent reorders the ranked list.
8. Parent selects schools and clicks `Do it`.
9. SchoolPick creates a public-school ranked-choice checklist or private-school application checklist.
10. SchoolPick drafts and sends an admissions/enrollment email through AgentMail.
11. A demo reply arrives and updates the Convex timeline in real time.

## Goals

- Make school selection practical, not just informational.
- Use real public data for a judge-runnable demo.
- Make commute and bell times first-class ranking inputs.
- Explain rankings with citations from crawled sources.
- Convert selected schools into clear actions.
- Show deep Convex usage through live data, workflows, and real-time status updates.
- Keep final submission to official portals as a handoff, while automating all preparation work inside SchoolPick.

## Non-Goals

- Do not claim to guarantee school assignment unless the district exposes reliable assignment data.
- Do not submit final public-school applications into district portals in the MVP.
- Do not scrape or republish paywalled review content.
- Do not provide legal, educational, or admissions guarantees.
- Do not present AI scores as objective truth; present them as evidence-backed estimates.
- Do not require real school replies for the judge demo.

## Key Product Caveats

SchoolPick must distinguish:

- District for an address.
- Public schools available through choice, lottery, transfer, charter, magnet, or attendance boundary rules.
- Guaranteed assigned school, only when verified.

For the MVP, use language like "eligible district and application options" unless district-specific assignment data is integrated.

## Input Requirements

Required inputs:

- Home address.
- Child grade.
- Preferred leaving time.
- Max commute time.
- Parent priority factors.

Optional inputs:

- Dropoff buffer.
- Desired school type: public, private, or both.
- Max tuition for private schools.
- Need after-school care.
- Need language immersion.
- Need special education or learning support.
- Sibling enrollment notes.
- Transportation mode, initially driving only.

## School Priority Factors

Default factor list:

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

Each factor has:

- Label.
- Description.
- Parent-selected weight.
- Score from 0 to 5.
- Evidence snippets.
- Source URLs.
- Confidence.
- Notes and caveats.

## MVP Functional Requirements

### Search Intake

- Show a first-screen search form, not a marketing page.
- Collect address, grade, preferred leaving time, max commute, and priority factors.
- Provide sensible defaults:

  - Preferred leaving time: 7:30 AM.
  - Max commute: 25 minutes.
  - Dropoff buffer: 10 minutes.
  - School type: public and private.

- Validate address and grade before starting.

### District Lookup

- Geocode the address.
- Determine the public school district using public geography data.
- For MVP, prefer a San Francisco-specific path if nationwide lookup is unreliable.
- Store district lookup result and source metadata.

### School Discovery

Public schools:

- Load schools in the district that serve the selected grade.
- Include name, address, grades served, school type, website, start time, end time, and district application URL when available.

Private schools:

- Load nearby private schools that serve the selected grade.
- Include name, address, grades served, website, phone, religious affiliation when available, and admissions URL when available.

### Bell Time And Commute Filtering

- For each school, calculate morning driving time from home to school.
- Use the parent's preferred leaving time as route departure time.
- Calculate arrival estimate:

  `arrival time = preferred leaving time + drive duration`

- Calculate workable estimate:

  `workable = arrival time + dropoff buffer <= school start time`

- Filter defaults:

  - Hide schools over max commute.
  - Hide schools that cannot be reached before start time with dropoff buffer.

- Allow toggling hidden schools back on for comparison.

### School Scoring

- Crawl school website, district profile, application page, and relevant public information pages.
- Extract factor evidence with OpenAI.
- Score each selected factor on a 0 to 5 scale.
- Produce a weighted total score.
- Produce a parent-readable explanation:

  - Why this school ranks highly.
  - What concerns or missing data exist.
  - Which sources support the rating.

- Never invent missing facts. Mark unknowns as unknown.

### Ranking And Manual Reorder

- Display ranked schools after filtering.
- Let parent manually drag schools into a custom preference order.
- Preserve both AI rank and parent rank.
- Show what changed after manual reorder.

### Action Plan

- When parent selects one or more schools, create application todos.
- Todos must be typed actions, not static advice.

Todo fields:

- Title.
- School.
- Application track: public or private.
- Action type.
- Status.
- Required inputs.
- Source links.
- Due date.
- Owner.
- Generated artifact, when applicable.
- Result.

Action types:

- `build_ranked_list`
- `extract_requirements`
- `draft_email`
- `send_email`
- `draft_parent_statement`
- `prepare_document_checklist`
- `schedule_reminder`
- `handoff_to_portal`
- `wait_for_reply`
- `summarize_reply`

### `Do it` Behavior

Each actionable todo has a `Do it` button.

Examples:

- `Build ranked-choice list`: uses current parent ranking to generate a public-school preference list and explanation.
- `Extract required documents`: crawls district or school admissions pages and creates a checklist.
- `Draft enrollment email`: generates an email asking targeted questions about eligibility, deadlines, and application steps.
- `Send email`: sends approved email through AgentMail.
- `Prepare parent statement`: creates a first draft using parent-provided notes.
- `Handoff to portal`: opens or displays final submission instructions for the official portal.
- `Wait for reply`: tracks the sent email and moves the todo forward when AgentMail receives a reply.
- `Summarize reply`: summarizes inbound email, extracts next steps, and creates follow-up todos.

### Messaging

- Create a demo application inbox for each family search or selected school.
- Use AgentMail for outbound inquiry emails.
- Accept inbound replies.
- Show messages in a timeline.
- Summarize replies with OpenAI.
- Update todos based on reply content.

### Timeline

Each search/application should have a timeline of:

- Search created.
- Schools loaded.
- Commute calculated.
- Sources crawled.
- Scores generated.
- Ranking changed.
- Application plan created.
- Email drafted.
- Email sent.
- Reply received.
- Reply summarized.
- Todo completed.

Convex should update this timeline live.

## UX Requirements

First screen:

- Search form and current criteria.
- No marketing hero.
- Parent can start the demo immediately.

Results view:

- Left panel: filters and weights.
- Main panel: school list.
- Right panel or details drawer: selected school evidence, commute, bell time, and actions.

School card:

- Name.
- Type: public, charter, private, etc.
- Grade fit.
- Start/end time.
- Drive time.
- Arrival buffer.
- Overall score.
- Top strengths.
- Concerns or unknowns.
- Source count.

Comparison view:

- Table of selected schools.
- Rows for factors.
- Columns for schools.
- Scores and concise evidence.
- Manual ranking controls.

Application view:

- Selected school list.
- Public ranked-choice list.
- Private-school application cards.
- Todos with `Do it` buttons.
- Timeline and inbox.

## Data Model

Suggested Convex tables:

- `families`
- `searches`
- `districts`
- `schools`
- `schoolSources`
- `commuteEstimates`
- `factorDefinitions`
- `schoolFactorScores`
- `rankings`
- `applications`
- `todos`
- `messages`
- `timelineEvents`
- `artifacts`

### `searches`

- `familyId`
- `address`
- `lat`
- `lng`
- `grade`
- `preferredLeaveTime`
- `maxCommuteMinutes`
- `dropoffBufferMinutes`
- `schoolTypes`
- `selectedFactors`
- `status`
- `createdAt`
- `updatedAt`

### `schools`

- `externalId`
- `name`
- `schoolType`
- `districtId`
- `address`
- `lat`
- `lng`
- `gradesServed`
- `websiteUrl`
- `admissionsUrl`
- `startTime`
- `endTime`
- `source`
- `lastVerifiedAt`

### `schoolFactorScores`

- `searchId`
- `schoolId`
- `factorKey`
- `score`
- `confidence`
- `evidence`
- `sourceIds`
- `notes`
- `createdAt`

### `rankings`

- `searchId`
- `schoolId`
- `aiRank`
- `parentRank`
- `weightedScore`
- `isShortlisted`
- `createdAt`
- `updatedAt`

### `todos`

- `applicationId`
- `schoolId`
- `title`
- `actionType`
- `status`
- `requiredInputs`
- `sourceLinks`
- `dueAt`
- `owner`
- `artifactId`
- `result`
- `createdAt`
- `updatedAt`

### `messages`

- `applicationId`
- `schoolId`
- `direction`
- `from`
- `to`
- `subject`
- `body`
- `summary`
- `agentMailMessageId`
- `receivedAt`
- `createdAt`

## Backend Workflows

### `startSchoolSearch`

Input:

- Address.
- Grade.
- Preferred leaving time.
- Max commute.
- Dropoff buffer.
- Factor weights.

Steps:

1. Validate input.
2. Create `searches` record.
3. Geocode address.
4. Lookup district.
5. Load candidate schools.
6. Queue commute calculations.
7. Queue crawls and scoring.

### `calculateCommutes`

Steps:

1. Fetch candidate schools.
2. Call route matrix provider.
3. Store duration and arrival buffer.
4. Mark schools workable or not.
5. Update timeline.

### `crawlSchoolSources`

Steps:

1. Build crawl URL list.
2. Call Firecrawl.
3. Store normalized content in `schoolSources`.
4. Mark source status.
5. Update timeline.

### `scoreSchools`

Steps:

1. Load selected parent factors.
2. Load crawled source text.
3. Ask OpenAI to extract evidence and score factors.
4. Store scores with citations and confidence.
5. Calculate weighted score.
6. Create ranking records.

### `createApplicationPlan`

Steps:

1. Read shortlisted schools and parent rank.
2. Identify public versus private application tracks.
3. Create application records.
4. Generate typed todos.
5. Create timeline event.

### `runTodoAction`

Input:

- `todoId`
- optional user-provided inputs.

Steps:

1. Validate todo status and required inputs.
2. Dispatch by `actionType`.
3. Generate artifact or send email.
4. Update todo status.
5. Create timeline event.

### `processInboundEmail`

Steps:

1. Receive AgentMail webhook.
2. Attach message to application.
3. Summarize reply with OpenAI.
4. Extract deadlines, requirements, or answers.
5. Update related todo.
6. Create follow-up todos if needed.
7. Update timeline in real time.

## AI Output Requirements

All OpenAI extraction should return structured JSON.

School factor scoring output:

```json
{
  "schoolId": "string",
  "scores": [
    {
      "factorKey": "after_school",
      "score": 4,
      "confidence": "high",
      "evidence": "The school page describes daily after-school care until 6 PM.",
      "sourceUrls": ["https://example.edu/after-school"],
      "missingData": []
    }
  ],
  "summary": "Strong fit for after-school care and commute, with limited public evidence for STEM.",
  "concerns": ["Tuition data was not found on public pages."]
}
```

Todo generation output:

```json
{
  "todos": [
    {
      "title": "Request admissions tour",
      "actionType": "draft_email",
      "requiredInputs": ["parentName", "childGrade"],
      "sourceLinks": ["https://example.edu/admissions"],
      "dueDate": "2026-10-15"
    }
  ]
}
```

## Safety And Trust Requirements

- Show source links for every factual claim.
- Label AI scores as estimates.
- Mark low-confidence or missing information clearly.
- Require user approval before sending emails.
- Do not send sensitive child information in demo mode.
- Avoid protected-class inferences.
- Avoid recommending against schools based on demographic assumptions.
- Keep parent-provided notes private.

## E2E Demo Requirements

The demo must complete within three minutes:

1. Load a saved demo scenario.
2. Start search.
3. Show candidates and commute filtering.
4. Show scored and cited ranking.
5. Drag one school up or down.
6. Create application plan.
7. Click `Do it` on an email todo.
8. Send through AgentMail demo inbox.
9. Trigger or receive demo reply.
10. Show Convex live update and completed/follow-up todo.

Fallback if external services are slow:

- Keep a seeded demo search.
- Store cached crawled sources.
- Store cached commute estimates.
- Still run one live sponsor action during the demo, preferably AgentMail or Convex workflow status.

## Success Metrics

Hackathon demo success:

- Judge can run the full flow from search to application todo.
- At least one Firecrawl source is crawled live or replayed from stored source metadata.
- At least one OpenAI scoring/extraction step runs.
- At least one AgentMail email is sent and processed.
- Convex displays live status changes without manual refresh.

User value success:

- Parent can identify 3 to 7 realistic schools.
- Parent can understand why each school was ranked.
- Parent can complete at least one application preparation action from the app.
- Parent leaves with a ranked list and next-step checklist.

## Open Questions

- Which exact San Francisco demo address should be used?
- Should the MVP support all grades or only kindergarten, 6th grade, and 9th grade?
- Which commute provider should be used first: Google Routes API, Mapbox, or a static seeded estimate for demo reliability?
- How should private schools be sourced in the first build: NCES PSS, Google Places, Firecrawl search, or a curated San Francisco seed list?
- Which review/information sources are allowed and useful without violating terms?
- Should parent accounts be required for MVP, or should the demo use anonymous searches?
