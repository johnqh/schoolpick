# SchoolPick Handoff

Last updated: 2026-08-28T21:30:16Z

This file is the restart point for continuing SchoolPick after a reboot or a new Codex session.

## Current State

- Repo: `https://github.com/johnqh/schoolpick`
- Local path: `~/projects/schoolpick`
- Branch: `main`
- Latest pushed commit before this handoff doc: `bcef7d0`
- Convex mode currently used during development: local Convex backend, not a linked cloud project
- Public app deployment: not done yet
- Local demo: verified with Convex CLI and Vite during development

SchoolPick currently runs a complete end-to-end demo in fallback mode:

1. Start a San Francisco demo search.
2. Rank schools by grade fit, commute fit, bell time, and parent priorities.
3. Shortlist and manually reorder schools.
4. Generate public/private application plans.
5. Click `Do it` on typed todos.
6. Draft an admissions/enrollment email.
7. Send through the AgentMail action.
8. Fall back to a simulated send/reply loop when AgentMail env vars are not set.
9. Update Convex communications, timeline, todos, and integration run history.

## Important Files

- `README.md`: user-facing overview, setup commands, optional integration env vars.
- `hackathon.md`: chronological hackathon build log.
- `hackathon/SPEC.md`: full product spec.
- `hackathon/PLAN.md`: full implementation plan.
- `hackathon/TODOS.md`: remaining work checklist.
- `src/App.tsx`: React UI, search form, ranked schools, application actions, integration panel.
- `convex/schema.ts`: Convex data model.
- `convex/schoolpick.ts`: queries, mutations, actions, internal helpers, seeded demo data.
- `convex/http.ts`: AgentMail webhook route.
- `convex/convex.config.ts`: Convex app config, static hosting component, typed optional env vars.
- `convex/_generated/ai/guidelines.md`: read this before editing Convex code.

## Resume Commands

From a fresh terminal:

```sh
cd ~/projects/schoolpick
git status --short --branch
git pull
npm install
npx convex dev --once
npm run lint
npm run build
```

To run the app locally without opening a browser:

```sh
npx convex dev --start "vite --host 127.0.0.1 --port 5177"
```

If port `5177` is busy, Vite will pick the next available port. Use the URL printed by Vite.

## Current Verification

The following passed after the integration work:

```sh
npx convex dev --once
npm run lint
npm run build
npx convex run schoolpick:startDemoSearch '{}'
npx convex run schoolpick:refreshSchoolSources '{"searchId":"..."}'
npx convex run schoolpick:rescoreWithOpenAI '{"searchId":"..."}'
npx convex run schoolpick:createApplicationPlan '{"searchId":"..."}'
npx convex run schoolpick:runTodoAction '{"todoId":"..."}'
npx convex run schoolpick:sendTodoEmail '{"todoId":"..."}'
```

The provider actions intentionally work without credentials by recording demo fallback runs.

## Optional Live Integrations

Set these as Convex environment variables when a cloud Convex project is linked:

```sh
npx convex env set FIRECRAWL_API_KEY fc-your-key
npx convex env set OPENAI_API_KEY sk-your-key
npx convex env set OPENAI_MODEL gpt-4o-mini
npx convex env set AGENTMAIL_API_KEY your-agentmail-key
npx convex env set AGENTMAIL_INBOX_ID your-inbox-id
npx convex env set SCHOOLPICK_DEMO_RECIPIENT judge-or-test@example.com
npx convex env set AGENTMAIL_WEBHOOK_SECRET shared-webhook-secret
```

Notes:

- Firecrawl: hackathon build credits are available.
- OpenAI API: no hackathon API credits were listed; use a personal/project key or keep fallback mode.
- Convex: free plan should be enough for this MVP demo.
- AgentMail: configure the webhook only after a public deployment exists.

AgentMail webhook:

- App route: `/api/agentmail/webhook`
- Full URL after Convex static hosting deployment: use the deployed `convex.site` domain plus `/api/agentmail/webhook`.
- If `AGENTMAIL_WEBHOOK_SECRET` is set, configure AgentMail to send the same value in the `x-schoolpick-webhook-secret` header.

## Demo Script

1. Open the local or deployed app.
2. Click `Demo`.
3. Show the family criteria, selected grade, leave time, max commute, and priority factors.
4. Show ranked schools and the commute/start-time fit badges.
5. Click `Show all` to reveal commute misses, then hide them again.
6. Move a school up or down to show parent preference override.
7. Toggle a shortlist item.
8. Click `Create plan`.
9. In `Application actions`, click `Do it` on `Build ranked-choice list`.
10. Click `Do it` on a checklist todo.
11. Click `Do it` on an email todo, then click `Approve/send`.
12. Show the inbox message pair, follow-up `Review admissions reply` todo, timeline, and integration run panel.
13. Click `Sources` and `Rescore` in the integrations panel to show fallback/live provider run tracking.

## Known Constraints

- Address-to-district lookup is currently represented by the San Francisco demo path.
- Schools and commute durations are seeded for demo reliability.
- Firecrawl/OpenAI/AgentMail paths are integration-ready, but only live when env vars are set.
- Final district/private school portal submission is intentionally a handoff.
- No authentication is implemented.
- No public deployment has been completed.

## Rules For Future Work

- Before Convex edits, read `AGENTS.md` and `convex/_generated/ai/guidelines.md`.
- Keep demo fallback paths working even after adding live providers.
- Do not commit secrets or local `.env` contents.
- Run `npx convex dev --once`, `npm run lint`, and `npm run build` before pushing meaningful code changes.
- Update `hackathon.md` after significant changes with commit SHAs and verification notes.
