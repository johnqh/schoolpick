# SchoolPick Todos

Last updated: 2026-08-28T21:30:16Z

## Submission Blockers

- [ ] Link the repo to a Convex cloud project with `npx convex login`.
- [ ] Confirm the Convex project/deployment name and update `hackathon.md`.
- [ ] Set required Convex env vars for any live provider demo.
- [ ] Deploy the app to the required public URL path with `npm run deploy`.
- [ ] Verify the deployed public URL loads the SchoolPick app.
- [ ] Run the full deployed demo flow from search to application todo to email reply/fallback.
- [ ] Record an under-3-minute demo video.
- [ ] Prepare final submission text with app URL, repo URL, short description, and sponsor integrations.
- [ ] Submit on the hackathon submission site.

## Live Integration Todos

- [ ] Firecrawl: set `FIRECRAWL_API_KEY`.
- [ ] Firecrawl: test `refreshSchoolSources` against at least three school profile/admissions URLs.
- [ ] Firecrawl: confirm scraped markdown and summaries are stored in `schoolSources`.
- [ ] OpenAI: set `OPENAI_API_KEY`.
- [ ] OpenAI: keep or set `OPENAI_MODEL=gpt-4o-mini`.
- [ ] OpenAI: test `rescoreWithOpenAI` after Firecrawl has refreshed sources.
- [ ] OpenAI: verify factor evidence remains grounded in source summaries.
- [ ] AgentMail: set `AGENTMAIL_API_KEY`.
- [ ] AgentMail: set `AGENTMAIL_INBOX_ID`.
- [ ] AgentMail: set `SCHOOLPICK_DEMO_RECIPIENT`.
- [ ] AgentMail: set `AGENTMAIL_WEBHOOK_SECRET`.
- [ ] AgentMail: configure `message.received` webhook to `/api/agentmail/webhook` on the deployed domain.
- [ ] AgentMail: send one live email from an email todo.
- [ ] AgentMail: verify the webhook stores an inbound communication and marks the todo complete.

## Product Todos

- [ ] Replace the San Francisco-only district assumption with a real address-to-district lookup.
- [ ] Add a geocoder and persist geocoding source metadata.
- [ ] Import SFUSD directory data instead of relying only on curated seed records.
- [ ] Import SFUSD start/end time data from the official school year source.
- [ ] Add NCES public/private school sources for a broader real-data candidate set.
- [ ] Add a live route provider for morning drive time.
- [ ] Preserve seeded commute fallback for judging reliability.
- [ ] Add school detail/source drawer so parents can inspect raw evidence.
- [ ] Add factor weighting controls instead of fixed default weights.
- [ ] Add explicit missing-data labels for factors that cannot be scored confidently.
- [ ] Add private-school deadline extraction from admissions pages.
- [ ] Add public-school ranked-choice caveats in the UI.
- [ ] Add export/copy for the ranked-choice list and checklists.
- [ ] Add a final demo mode reset button or clear latest-search behavior.

## Engineering Todos

- [ ] Add focused Convex tests for `startDemoSearch`, ranking, todos, and email fallback.
- [ ] Add tests for `recordInboundAgentMailMessage` thread matching and duplicate handling.
- [ ] Add tests for OpenAI response parsing.
- [ ] Add tests for Firecrawl response parsing/error handling.
- [ ] Add a small seed-data import script if real SFUSD/NCES data is added.
- [ ] Add error toasts or inline error states for failed actions in `src/App.tsx`.
- [ ] Consider splitting `convex/schoolpick.ts` after the hackathon if it grows further.
- [ ] Add screenshots or a short demo GIF after deployment.

## Nice-To-Have

- [ ] Add auth for a real family workspace.
- [ ] Add co-parent sharing and realtime collaborative ranking.
- [ ] Add reminders/calendar export for application deadlines.
- [ ] Add tuition/financial-aid comparison for private schools.
- [ ] Add side-by-side school comparison table.
- [ ] Add multilingual support for parent-facing summaries.
- [ ] Add accessibility pass for keyboard focus and screen reader labels.
