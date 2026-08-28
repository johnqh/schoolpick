# Hackathon log

- **Project:** SchoolPick
- **Event:** Convex All Gas Hackathon
- **What it does:** Helps parents compare schools by address, grade, morning commute, start time, family priorities, and application steps.
- **Live app:** not deployed
- **Repo:** https://github.com/johnqh/schoolpick
- **Frontend:** Convex static hosting
- **Convex deployment:** not deployed
- **Components:** @convex-dev/static-hosting
- **Convex features:** schema, tables, indexes, queries, mutations, actions, internal functions, HTTP actions, typed env vars, realtime queries
- **Auth:** none
- **AI models:** `gpt-4o-mini` default through `OPENAI_MODEL`
- **Started:** 2026-08-26T18:25:07Z
- **Last updated:** 2026-08-28T21:30:16Z

## Log

### 2026-08-26 - aa1f93a

Started SchoolPick as a public hackathon repo and documented the core product concept: a parent-facing school selection assistant that combines address, grade, commute constraints, priority factors, school ranking, and application guidance (`README.md`).

### 2026-08-26 - 9b95f3e

Expanded the concept into a product spec and implementation plan. The docs define the parent search flow, San Francisco demo scope, real data sources, Convex data model, backend workflows, `Do it` actions, AgentMail loop, and milestone plan (`hackathon/SPEC.md`, `hackathon/PLAN.md`).

### 2026-08-26 - c431b60

Set up the runnable Convex + React/Vite app scaffold and installed local Convex agent guidance plus the Convex hackathon skill (`AGENTS.md`, `.agents/skills/`, `convex/_generated/ai/guidelines.md`). Added the initial messages schema, query, mutation, and realtime React client from the scaffold (`convex/schema.ts`, `convex/messages.ts`, `src/Chat/Chat.tsx`, `src/main.tsx`). Registered the `@convex-dev/static-hosting` component and deploy script for the required future `convex.site` deployment path, then documented local setup and deploy commands (`convex/convex.config.ts`, `package.json`, `README.md`).

### 2026-08-26 - 0530152

Implemented the first end-to-end SchoolPick demo flow. The app now starts a seeded San Francisco search, ranks schools by commute fit and family priorities, supports shortlist and manual preference reordering, creates application todos, runs `Do it` actions, simulates the email send/reply loop, and updates a live timeline through Convex (`src/App.tsx`, `convex/schoolpick.ts`).

Added the SchoolPick data model for searches, schools, crawled-source placeholders, commute estimates, factor scores, rankings, applications, todos, communications, timeline events, and artifacts. Convex features: schema, tables, indexes, queries, mutations, realtime queries (`convex/schema.ts`, `convex/schoolpick.ts`).

### 2026-08-27 - c151522

Added integration-ready live paths for the judge demo. Convex now exposes optional Firecrawl source refresh, OpenAI school rescoring, and AgentMail todo email sending as actions, with explicit demo-mode fallbacks when credentials are not set (`convex/schoolpick.ts`, `convex/convex.config.ts`, `convex/schema.ts`).

Added an AgentMail `message.received` webhook endpoint at `/api/agentmail/webhook` that matches replies by provider thread ID, stores inbound communications, marks the original email todo complete, creates a follow-up review todo, and updates the live timeline (`convex/http.ts`).

Updated the React app with an integrations panel showing provider configuration, recent provider runs, source refresh/rescore buttons, and a `waiting_for_reply` email state for live AgentMail sends (`src/App.tsx`). Documented optional Convex env vars and webhook secret setup in `README.md`.

Verification: `npx convex dev --once`, `npm run lint`, `npm run build`, and Convex CLI smoke tests for demo search creation, Firecrawl/OpenAI fallback actions, application plan creation, email draft creation, and AgentMail fallback send all passed.

### 2026-08-28 - ddd7c3b

Added restart-safe project handoff documentation and a remaining-work todo checklist. `hackathon/HANDOFF.md` records the current repo state, resume commands, verification commands, optional provider env vars, AgentMail webhook setup, demo script, known constraints, and future-work rules. `hackathon/TODOS.md` tracks submission blockers, live integration tasks, product tasks, engineering tasks, and nice-to-have improvements. Linked both files from `README.md`.
