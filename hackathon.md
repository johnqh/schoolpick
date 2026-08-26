# Hackathon log

- **Project:** SchoolPick
- **Event:** Convex All Gas Hackathon
- **What it does:** Helps parents compare schools by address, grade, morning commute, start time, family priorities, and application steps.
- **Live app:** not deployed
- **Repo:** https://github.com/johnqh/schoolpick
- **Frontend:** Convex static hosting
- **Convex deployment:** not deployed
- **Components:** @convex-dev/static-hosting
- **Convex features:** schema, tables, indexes, queries, mutations, realtime queries
- **Auth:** none
- **AI models:** none
- **Started:** 2026-08-26T18:25:07Z
- **Last updated:** 2026-08-26T20:57:36Z

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
