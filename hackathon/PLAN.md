# SchoolPick Implementation Plan

## Build Strategy

Build the smallest convincing vertical slice first:

1. Parent enters a San Francisco address and grade.
2. App loads real candidate schools.
3. App filters schools by commute and bell time.
4. App scores schools against selected factors with cited source evidence.
5. Parent reorders the preference list.
6. Parent creates an application plan.
7. Parent clicks `Do it` on one admissions/enrollment email action.
8. AgentMail sends the email and receives a demo reply.
9. Convex updates the application timeline live.

Everything else should support that path.

## Recommended Tech Stack

- Frontend: React, Vite, TypeScript.
- Styling: Tailwind CSS or plain CSS modules.
- Backend/database: Convex.
- Hosting: convex.site or chatgpt.site.
- AI: OpenAI structured outputs.
- Crawling: Firecrawl.
- Email: AgentMail.
- Route calculations: Google Routes API if available; otherwise seeded commute estimates for the demo path with provider abstraction.

## Milestones

### Milestone 0: Project Setup

Outcome: deployable skeleton connected to Convex.

Tasks:

- Initialize Vite React TypeScript app.
- Install Convex.
- Create Convex project.
- Add basic schema.
- Add seeded demo data path.
- Add environment variable placeholders.
- Add local dev scripts.
- Add deployment target.
- Add `/hackathon/BUILD_LOG.md`.

Definition of done:

- App runs locally.
- Convex queries work.
- A placeholder search page renders.
- Repo can be deployed.

### Milestone 1: Search Intake And Demo Scenario

Outcome: parent can start a school search.

Tasks:

- Build intake form:

  - Address.
  - Grade.
  - Preferred leaving time.
  - Max commute.
  - Dropoff buffer.
  - School type filter.
  - Priority factor selector.

- Add one-click demo scenario:

  - San Francisco address.
  - Grade.
  - Preferred leaving time.
  - Factor weights.

- Create `startSchoolSearch` mutation/action.
- Persist search criteria in Convex.
- Create initial timeline event.

Definition of done:

- Judge can click "Load demo" and "Find schools."
- Search record appears in Convex.
- Timeline shows search started.

### Milestone 2: School Discovery

Outcome: app displays real public and private school candidates.

Tasks:

- Create seed import for SFUSD schools:

  - School name.
  - Address.
  - Grades served.
  - Website.
  - Start time.
  - End time.
  - Public/private/charter classification.

- Add private school seed source from public data or curated demo list.
- Create `schools` table.
- Create `candidateSchools` query.
- Filter by grade.
- Store source URL and verification date for each record.

Definition of done:

- Search results show at least 10 candidate schools for the demo grade.
- Each school has address, grade fit, website, and start time where available.
- Missing start times are visible as unknown, not invented.

Implementation note:

- Use seeded school data first for reliability.
- Add live source refresh later through Firecrawl or data import jobs.

### Milestone 3: Commute And Bell-Time Fit

Outcome: app filters schools by morning feasibility.

Tasks:

- Create `commuteEstimates` table.
- Add route provider abstraction:

  - `getDrivingDuration(origin, destination, departureTime)`.
  - Google Routes implementation.
  - Seeded fallback implementation.

- Calculate:

  - Drive duration.
  - Estimated arrival.
  - Minutes before start.
  - Workable boolean.

- Add filters:

  - Max commute.
  - Arrive before start with dropoff buffer.
  - Show hidden schools toggle.

Definition of done:

- Result list updates based on preferred leaving time and max commute.
- Each school shows drive time, arrival estimate, school start time, and whether it works.
- Demo works even if route API is unavailable.

### Milestone 4: Source Crawling

Outcome: each shortlisted school has crawled source content.

Tasks:

- Create `schoolSources` table.
- Build source URL discovery:

  - School homepage.
  - Admissions page.
  - Program pages if linked.
  - District profile page where available.

- Add Firecrawl action:

  - Crawl selected URLs.
  - Store markdown/text.
  - Store status and timestamp.

- Add timeline events for crawl start/finish/error.
- Add source viewer in school detail drawer.

Definition of done:

- At least 3 schools have source content from Firecrawl.
- UI shows source count and last crawled time.
- Failures are visible and non-blocking.

### Milestone 5: AI Factor Scoring

Outcome: schools are ranked with cited factor scores.

Tasks:

- Define factor keys and scoring rubric.
- Build OpenAI structured output prompt.
- Create `schoolFactorScores` table.
- Score selected factors for each school.
- Store:

  - Score.
  - Confidence.
  - Evidence.
  - Source URLs.
  - Missing data.

- Compute weighted score.
- Create `rankings` records.
- Add school cards with score explanation.
- Add comparison table.

Definition of done:

- Each displayed school has a total score.
- At least 5 selected factors show score/evidence/confidence.
- Unknowns are represented explicitly.
- Parent can inspect source links.

### Milestone 6: Manual Ranking

Outcome: parent can create their own preference order.

Tasks:

- Add shortlist button.
- Add drag-and-drop or up/down controls.
- Store `parentRank` separately from `aiRank`.
- Show final preference list.
- Add timeline event when ranking changes.

Definition of done:

- Parent can reorder shortlisted schools.
- Refreshing the page preserves the order.
- Public application plan uses the parent order.

### Milestone 7: Application Plan

Outcome: selected schools become typed todos.

Tasks:

- Create `applications` table.
- Create `todos` table.
- Add `createApplicationPlan` mutation/action.
- Generate public-school todos:

  - Build ranked-choice list.
  - Extract required documents.
  - Draft enrollment question email.
  - Prepare portal handoff checklist.
  - Track deadline.

- Generate private-school todos:

  - Request tour.
  - Draft admissions email.
  - Prepare document checklist.
  - Draft parent statement.
  - Track recommendation/interview deadlines.

- Display todos grouped by school and application track.

Definition of done:

- Clicking "Create application plan" produces todos.
- Todos have action type, status, source links, and `Do it` buttons.
- Public and private schools produce different todo sets.

### Milestone 8: `Do it` Actions

Outcome: todos execute useful work.

Tasks:

- Implement action dispatcher:

  - `build_ranked_list`
  - `extract_requirements`
  - `draft_email`
  - `send_email`
  - `prepare_document_checklist`
  - `handoff_to_portal`
  - `wait_for_reply`
  - `summarize_reply`

- Add generated artifact storage.
- Add approval step before sending email.
- Add completion states:

  - Not started.
  - Needs input.
  - Drafted.
  - Ready to send.
  - Waiting for reply.
  - Done.
  - Blocked.

Definition of done:

- Judge can click `Do it` on at least 3 todo types.
- One todo generates a ranked-choice list.
- One todo generates a document checklist.
- One todo drafts an email ready for approval.

### Milestone 9: AgentMail Loop

Outcome: an email action can complete end to end.

Tasks:

- Create or configure demo inbox.
- Add `messages` table.
- Implement send email action through AgentMail.
- Implement inbound webhook handling.
- Summarize replies with OpenAI.
- Update todo status from `waiting_for_reply` to `done` or `needs_followup`.
- Add timeline events.

Definition of done:

- Judge can send a demo admissions/enrollment email.
- Demo reply is received or triggered.
- App updates without refresh.
- Reply summary and follow-up todo appear.

### Milestone 10: Polish And Deployment

Outcome: reliable public demo.

Tasks:

- Add landing route that opens directly to the app.
- Add responsive layout.
- Add empty, loading, error, and slow-service states.
- Add source/citation display.
- Add demo reset.
- Add seeded fallback data for all external calls.
- Deploy publicly.
- Record under-3-minute demo.
- Add final hackathon README/build log.

Definition of done:

- Public deployment runs the full demo.
- No external failure blocks the demo path.
- README explains how judges can run it.
- `/hackathon/BUILD_LOG.md` shows build progress.

## Convex Schema Plan

Initial schema:

```ts
families
searches
districts
schools
schoolSources
commuteEstimates
factorDefinitions
schoolFactorScores
rankings
applications
todos
messages
timelineEvents
artifacts
```

Indexes:

- `searches.by_family`
- `schools.by_district`
- `schools.by_grade`
- `schoolSources.by_school`
- `commuteEstimates.by_search_school`
- `schoolFactorScores.by_search_school`
- `rankings.by_search`
- `applications.by_search`
- `todos.by_application`
- `messages.by_application`
- `timelineEvents.by_search`

## Convex Function Plan

Queries:

- `getSearch`
- `listCandidateSchools`
- `listRankedSchools`
- `listApplications`
- `listTodos`
- `listMessages`
- `listTimelineEvents`

Mutations:

- `createDemoSearch`
- `updateSearchCriteria`
- `toggleShortlist`
- `updateParentRanking`
- `createApplicationPlan`
- `updateTodoStatus`
- `saveDraftArtifact`

Actions:

- `startSchoolSearch`
- `lookupDistrict`
- `loadCandidateSchools`
- `calculateCommutes`
- `crawlSchoolSources`
- `scoreSchools`
- `runTodoAction`
- `sendApplicationEmail`
- `processInboundEmail`

## Frontend Plan

Routes:

- `/`: app entry and search intake.
- `/search/:searchId`: results, filters, rankings, school details.
- `/search/:searchId/applications`: application plan, todos, inbox, timeline.

Major components:

- `SearchForm`
- `DemoScenarioButton`
- `FactorPicker`
- `SchoolResultsList`
- `SchoolCard`
- `SchoolDetailDrawer`
- `CommuteBadge`
- `FactorScoreTable`
- `ShortlistPanel`
- `PreferenceRanker`
- `ApplicationPlan`
- `TodoList`
- `DoItButton`
- `ArtifactPreview`
- `InboxTimeline`
- `SourceCitationList`

UI principles:

- Dense but approachable.
- Prioritize school comparison over marketing copy.
- Make commute feasibility visually obvious.
- Show citations near scores.
- Keep `Do it` buttons directly attached to todos.

## Demo Data Plan

Create a seeded demo search:

- Address: San Francisco address selected after route testing.
- Grade: kindergarten or 6th grade.
- Preferred leaving time: 7:35 AM.
- Max commute: 25 minutes.
- Dropoff buffer: 10 minutes.
- Factors:

  - Commute fit.
  - After-school care.
  - Language immersion.
  - Academics.
  - School size.
  - Application simplicity.

Seed at least:

- 8 SFUSD schools.
- 4 private schools.
- Bell times.
- Websites/admissions URLs.
- Cached source extracts for fallback.
- Cached commute estimates for fallback.
- One demo inbound email payload.

## External Service Fallbacks

Route provider unavailable:

- Use cached commute estimates.
- Show "cached demo estimate" label.

Firecrawl unavailable:

- Use cached source extracts.
- Show source timestamp.

OpenAI unavailable:

- Use cached structured scoring results.
- Keep citations from cached source extracts.

AgentMail unavailable:

- Save outbound email artifact.
- Let judge trigger a local demo reply event.

## Testing Plan

Unit tests:

- Grade range matching.
- Commute feasibility calculation.
- Weighted score calculation.
- Todo generation by school type.
- Action dispatcher status transitions.

Integration tests:

- Create demo search.
- Load candidates.
- Calculate commute fallback.
- Score school from cached source.
- Create application plan.
- Run `draft_email` todo.
- Process demo inbound email.

E2E tests:

- Load demo scenario.
- Submit search.
- Filter by commute.
- Open school details.
- Shortlist schools.
- Reorder list.
- Create application plan.
- Click `Do it`.
- Verify timeline update.

Manual pre-demo checklist:

- Public URL loads.
- Demo reset works.
- At least one live Convex update is visible.
- At least one sponsor integration is live.
- Fallback path works without external APIs.

## Build Log Plan

Add `/hackathon/BUILD_LOG.md` and update it as implementation progresses.

Suggested entries:

- Project created.
- Spec and plan written.
- Convex app initialized.
- Schema added.
- Demo data added.
- Search flow implemented.
- Commute filtering implemented.
- Firecrawl ingestion implemented.
- OpenAI scoring implemented.
- Application todos implemented.
- AgentMail loop implemented.
- Public deployment created.

## Risks And Mitigations

### School Boundary Complexity

Risk:

- Districts vary in assignment rules, lottery systems, charters, magnets, and transfers.

Mitigation:

- MVP says "district and application options."
- Only say "assigned school" when district-specific data proves it.

### Private School Data Quality

Risk:

- Private-school grade ranges, admissions URLs, and tuition data can be incomplete.

Mitigation:

- Seed reliable San Francisco private schools for the demo.
- Mark unknowns clearly.
- Use Firecrawl to extract admissions details where available.

### Review Site Restrictions

Risk:

- Some school review sites may restrict scraping or provide low-quality data.

Mitigation:

- Prefer official school, district, NCES, and publicly accessible pages.
- Make review sites optional.
- Cite source types.

### Commute API Reliability

Risk:

- Traffic-aware route APIs need keys and may fail during demo.

Mitigation:

- Route provider abstraction.
- Cached demo commute estimates.
- Clear "live" versus "cached" label.

### AI Trust

Risk:

- AI may overstate evidence or mis-score schools.

Mitigation:

- Structured outputs.
- Citation requirement.
- Unknown handling.
- Confidence labels.
- User-controlled ranking.

### Demo Timing

Risk:

- Crawling and scoring multiple schools can be slow.

Mitigation:

- Crawl/score only top candidates live.
- Use cached sources for full list.
- Provide progress timeline.

## Prioritized MVP Backlog

P0:

- Search intake.
- Seeded SF schools.
- Commute feasibility.
- Factor scoring from cached or crawled sources.
- Ranked list.
- Manual reorder.
- Application plan.
- One `Do it` email action.
- AgentMail demo reply.
- Convex timeline.
- Public deployment.

P1:

- Live Firecrawl for more schools.
- Google Routes live traffic.
- Private-school admissions checklist extraction.
- Parent statement draft.
- Comparison table.
- Demo reset.

P2:

- Multi-parent collaboration.
- Account auth.
- Calendar export.
- More districts.
- More transportation modes.
- Better school boundary integration.

## Suggested Two-Day Hackathon Schedule

### Day 1

Morning:

- Initialize app and Convex.
- Create schema.
- Add seeded data.
- Build search intake.

Afternoon:

- Build school results.
- Add commute feasibility.
- Add shortlist and manual ranking.

Evening:

- Add Firecrawl ingestion for selected schools.
- Add OpenAI scoring with cached fallback.

### Day 2

Morning:

- Add application plan and todos.
- Implement `Do it` actions for ranked list, checklist, and email draft.

Afternoon:

- Add AgentMail send/reply loop.
- Add timeline.
- Polish demo path.

Evening:

- Deploy.
- Record demo.
- Update build log and README.
- Final test from clean browser.

## Final Demo Script

1. Open SchoolPick.
2. Click `Load demo`.
3. Click `Find schools`.
4. Explain that the app found real SF school options for the grade.
5. Show commute filtering from preferred leaving time to school start time.
6. Open one school and show factor evidence with citations.
7. Drag a preferred school higher in the list.
8. Click `Create application plan`.
9. Click `Do it` on "Draft enrollment question email."
10. Approve and send email.
11. Trigger demo reply.
12. Show live timeline update and follow-up todo.

## Immediate Next Step

Initialize the actual app and Convex project, then implement the seeded demo path before adding live integrations.
