import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  EnvelopeClosedIcon,
  LightningBoltIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { useMutation, useQuery } from "convex/react";
import { FormEvent, useMemo, useState } from "react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

const fallbackFactors = [
  { key: "commute_fit", label: "Commute fit" },
  { key: "after_school", label: "After-school care" },
  { key: "language_immersion", label: "Language immersion" },
  { key: "academics", label: "Academics" },
  { key: "school_size", label: "School size" },
  { key: "application_simplicity", label: "Application simplicity" },
];

const defaultFactorKeys = fallbackFactors.map((factor) => factor.key);
const defaultWeights: Record<string, number> = {
  commute_fit: 2,
  academics: 2,
  after_school: 1,
  language_immersion: 1,
  school_size: 1,
  application_simplicity: 1,
};

export default function App() {
  const factors = useQuery(api.schoolpick.listFactorDefinitions);
  const latestSearch = useQuery(api.schoolpick.latestSearch);
  const startSearch = useMutation(api.schoolpick.startSearch);
  const startDemoSearch = useMutation(api.schoolpick.startDemoSearch);
  const toggleShortlist = useMutation(api.schoolpick.toggleShortlist);
  const moveRanking = useMutation(api.schoolpick.moveRanking);
  const createApplicationPlan = useMutation(api.schoolpick.createApplicationPlan);
  const runTodoAction = useMutation(api.schoolpick.runTodoAction);
  const sendDraftEmail = useMutation(api.schoolpick.sendDraftEmail);

  const [activeSearchId, setActiveSearchId] = useState<Id<"searches"> | null>(
    null,
  );
  const [address, setAddress] = useState("Inner Sunset, San Francisco, CA");
  const [grade, setGrade] = useState("K");
  const [leaveTime, setLeaveTime] = useState("07:35");
  const [maxCommute, setMaxCommute] = useState(25);
  const [dropoffBuffer, setDropoffBuffer] = useState(10);
  const [selectedFactorKeys, setSelectedFactorKeys] =
    useState<string[]>(defaultFactorKeys);
  const [showHiddenSchools, setShowHiddenSchools] = useState(false);
  const [busyLabel, setBusyLabel] = useState<string | null>(null);

  const searchId = activeSearchId ?? latestSearch?._id ?? null;
  const search = useQuery(
    api.schoolpick.getSearch,
    searchId ? { searchId } : "skip",
  );
  const rankedSchools = useQuery(
    api.schoolpick.listRankedSchools,
    searchId ? { searchId } : "skip",
  );
  const applications = useQuery(
    api.schoolpick.listApplications,
    searchId ? { searchId } : "skip",
  );
  const timeline = useQuery(
    api.schoolpick.listTimeline,
    searchId ? { searchId } : "skip",
  );

  const availableFactors = factors ?? fallbackFactors;
  const visibleSchools = useMemo(() => {
    if (!rankedSchools || !search || showHiddenSchools) {
      return rankedSchools ?? [];
    }
    return rankedSchools.filter((row) => {
      const commute = row.commute;
      return (
        commute !== null &&
        commute.workable &&
        commute.durationMinutes <= search.maxCommuteMinutes
      );
    });
  }, [rankedSchools, search, showHiddenSchools]);

  const shortlistedCount =
    rankedSchools?.filter((row) => row.ranking.shortlisted).length ?? 0;
  const hasApplications = (applications?.length ?? 0) > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyLabel("Finding schools");
    try {
      const searchIdFromMutation = await startSearch({
        address,
        grade,
        preferredLeaveTimeMinutes: parseTime(leaveTime),
        maxCommuteMinutes: maxCommute,
        dropoffBufferMinutes: dropoffBuffer,
        selectedFactors: selectedFactorKeys.map((key) => ({
          key,
          weight: defaultWeights[key] ?? 1,
        })),
        scenarioName: "Custom family search",
      });
      setActiveSearchId(searchIdFromMutation);
    } finally {
      setBusyLabel(null);
    }
  }

  async function handleDemoSearch() {
    setBusyLabel("Loading demo");
    try {
      const searchIdFromMutation = await startDemoSearch({});
      setActiveSearchId(searchIdFromMutation);
      setGrade("K");
      setLeaveTime("07:35");
      setMaxCommute(25);
      setDropoffBuffer(10);
      setSelectedFactorKeys(defaultFactorKeys);
    } finally {
      setBusyLabel(null);
    }
  }

  async function handleCreatePlan() {
    if (!searchId) {
      return;
    }
    setBusyLabel("Creating application plan");
    try {
      await createApplicationPlan({ searchId });
    } finally {
      setBusyLabel(null);
    }
  }

  function toggleFactor(key: string) {
    setSelectedFactorKeys((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-stone-950">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              SchoolPick
            </p>
            <h1 className="text-2xl font-semibold tracking-normal">
              Pick schools that fit your child and your morning.
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-stone-600">
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1">
              Convex realtime backend
            </span>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1">
              Seeded SF demo data
            </span>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1">
              Actionable todos
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[360px_1fr]">
        <section className="space-y-4">
          <form
            onSubmit={(event) => void handleSubmit(event)}
            className="rounded-md border border-stone-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Family criteria</h2>
                <p className="text-sm text-stone-600">
                  Address, grade, bell time, commute, and priorities.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleDemoSearch()}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
              >
                <ReloadIcon />
                Demo
              </button>
            </div>

            <label className="block text-sm font-medium text-stone-800">
              Home address
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none ring-emerald-500 focus:ring-2"
              />
            </label>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium text-stone-800">
                Grade
                <select
                  value={grade}
                  onChange={(event) => setGrade(event.target.value)}
                  className="mt-1 h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none ring-emerald-500 focus:ring-2"
                >
                  {["K", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
                    (item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="block text-sm font-medium text-stone-800">
                Leave time
                <input
                  type="time"
                  value={leaveTime}
                  onChange={(event) => setLeaveTime(event.target.value)}
                  className="mt-1 h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none ring-emerald-500 focus:ring-2"
                />
              </label>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium text-stone-800">
                Max commute
                <input
                  type="number"
                  min={5}
                  max={90}
                  value={maxCommute}
                  onChange={(event) => setMaxCommute(Number(event.target.value))}
                  className="mt-1 h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none ring-emerald-500 focus:ring-2"
                />
              </label>
              <label className="block text-sm font-medium text-stone-800">
                Dropoff buffer
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={dropoffBuffer}
                  onChange={(event) =>
                    setDropoffBuffer(Number(event.target.value))
                  }
                  className="mt-1 h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none ring-emerald-500 focus:ring-2"
                />
              </label>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-stone-800">Priorities</p>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {availableFactors.map((factor) => {
                  const selected = selectedFactorKeys.includes(factor.key);
                  return (
                    <button
                      key={factor.key}
                      type="button"
                      onClick={() => toggleFactor(factor.key)}
                      className={[
                        "flex min-h-10 items-center justify-between rounded-md border px-3 text-left text-sm transition",
                        selected
                          ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                          : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100",
                      ].join(" ")}
                    >
                      <span>{factor.label}</span>
                      {selected ? <CheckIcon className="shrink-0" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={busyLabel !== null || selectedFactorKeys.length === 0}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              <MagnifyingGlassIcon />
              Find schools
            </button>
          </form>

          <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Current search</h2>
                <p className="text-sm text-stone-600">
                  {search
                    ? `${search.grade} in ${search.districtName}`
                    : "Start or load a demo search."}
                </p>
              </div>
              {busyLabel ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                  {busyLabel}
                </span>
              ) : null}
            </div>
            {search ? (
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <Metric label="Leave" value={formatTime(search.preferredLeaveTimeMinutes)} />
                <Metric label="Max drive" value={`${search.maxCommuteMinutes} min`} />
                <Metric label="Buffer" value={`${search.dropoffBufferMinutes} min`} />
                <Metric label="Shortlist" value={`${shortlistedCount} schools`} />
              </div>
            ) : null}
          </section>

          <Timeline events={timeline ?? []} />
        </section>

        <section className="space-y-4">
          <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Ranked schools</h2>
                <p className="text-sm text-stone-600">
                  Filtered by grade, morning commute, start time, and selected
                  priorities.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowHiddenSchools((value) => !value)}
                  className="h-9 rounded-md border border-stone-300 px-3 text-sm font-medium hover:bg-stone-50"
                >
                  {showHiddenSchools ? "Hide commute misses" : "Show all"}
                </button>
                <button
                  type="button"
                  disabled={!searchId || shortlistedCount === 0}
                  onClick={() => void handleCreatePlan()}
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  <PlusIcon />
                  Create plan
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {rankedSchools === undefined ? (
                <EmptyState title="Loading schools" body="Convex is preparing the live result set." />
              ) : visibleSchools.length === 0 ? (
                <EmptyState
                  title="No workable schools in view"
                  body="Try a later leave time, longer commute limit, or show commute misses."
                />
              ) : (
                visibleSchools.map((row, index) => {
                  const topScores = row.scores
                    .slice()
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3);
                  return (
                    <article
                      key={row.school._id}
                      className="rounded-md border border-stone-200 bg-white p-4"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-700">
                              #{row.ranking.parentRank}
                            </span>
                            <span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-900">
                              {row.school.schoolType}
                            </span>
                            <span
                              className={[
                                "rounded-full px-2 py-1 text-xs font-semibold",
                                row.commute?.workable
                                  ? "bg-emerald-50 text-emerald-900"
                                  : "bg-rose-50 text-rose-900",
                              ].join(" ")}
                            >
                              {row.commute?.workable ? "Morning works" : "Timing miss"}
                            </span>
                          </div>
                          <h3 className="mt-2 text-lg font-semibold">
                            {row.school.name}
                          </h3>
                          <p className="mt-1 text-sm text-stone-600">
                            {row.school.address}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <Metric
                            label="Score"
                            value={`${row.ranking.weightedScore.toFixed(1)}/5`}
                          />
                          <Metric
                            label="Drive"
                            value={
                              row.commute
                                ? `${row.commute.durationMinutes} min`
                                : "Unknown"
                            }
                          />
                          <Metric
                            label="Start"
                            value={formatTime(row.school.startTimeMinutes)}
                          />
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2 md:grid-cols-3">
                        {topScores.map((score) => (
                          <div
                            key={score._id}
                            className="min-h-24 rounded-md border border-stone-200 bg-stone-50 p-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold">
                                {labelForFactor(availableFactors, score.factorKey)}
                              </p>
                              <span className="text-sm font-semibold">
                                {score.score.toFixed(1)}
                              </span>
                            </div>
                            <p className="mt-2 line-clamp-3 text-xs leading-5 text-stone-600">
                              {score.evidence}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            void toggleShortlist({
                              searchId: row.ranking.searchId,
                              schoolId: row.school._id,
                            })
                          }
                          className={[
                            "h-9 rounded-md border px-3 text-sm font-medium",
                            row.ranking.shortlisted
                              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                              : "border-stone-300 hover:bg-stone-50",
                          ].join(" ")}
                        >
                          {row.ranking.shortlisted ? "Shortlisted" : "Shortlist"}
                        </button>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() =>
                            void moveRanking({
                              searchId: row.ranking.searchId,
                              schoolId: row.school._id,
                              direction: "up",
                            })
                          }
                          className="inline-flex h-9 items-center gap-1 rounded-md border border-stone-300 px-3 text-sm font-medium hover:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-300"
                        >
                          <ArrowUpIcon />
                          Move up
                        </button>
                        <button
                          type="button"
                          disabled={index === visibleSchools.length - 1}
                          onClick={() =>
                            void moveRanking({
                              searchId: row.ranking.searchId,
                              schoolId: row.school._id,
                              direction: "down",
                            })
                          }
                          className="inline-flex h-9 items-center gap-1 rounded-md border border-stone-300 px-3 text-sm font-medium hover:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-300"
                        >
                          <ArrowDownIcon />
                          Move down
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Application actions</h2>
                <p className="text-sm text-stone-600">
                  Every todo has a typed action and a `Do it` path.
                </p>
              </div>
              {!hasApplications ? (
                <button
                  type="button"
                  disabled={!searchId || shortlistedCount === 0}
                  onClick={() => void handleCreatePlan()}
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  <LightningBoltIcon />
                  Generate todos
                </button>
              ) : null}
            </div>

            <div className="mt-4 grid gap-3">
              {applications === undefined ? (
                <EmptyState title="Loading plan" body="Application actions will appear here." />
              ) : applications.length === 0 ? (
                <EmptyState
                  title="No application plan yet"
                  body="Shortlist schools, reorder the preference list, then create the plan."
                />
              ) : (
                applications.map((row) => (
                  <article
                    key={row.application._id}
                    className="rounded-md border border-stone-200 bg-stone-50 p-4"
                  >
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-semibold">{row.application.title}</h3>
                        <p className="text-sm text-stone-600">
                          {row.application.track === "public"
                            ? "One ranked-choice public application"
                            : row.school?.admissionsUrl}
                        </p>
                      </div>
                      <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-600">
                        {row.application.track}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2">
                      {row.todos.map((todo) => (
                        <div
                          key={todo._id}
                          className="rounded-md border border-stone-200 bg-white p-3"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium">{todo.title}</p>
                                <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600">
                                  {todo.status.replace("_", " ")}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-stone-600">
                                {todo.actionType} | {todo.dueLabel}
                              </p>
                            </div>
                            <TodoButton
                              status={todo.status}
                              actionType={todo.actionType}
                              onRun={() => void runTodoAction({ todoId: todo._id })}
                              onSend={() =>
                                void sendDraftEmail({ todoId: todo._id })
                              }
                            />
                          </div>
                          {todo.resultBody ? (
                            <div className="mt-3 rounded-md border border-stone-200 bg-stone-50 p-3">
                              <p className="text-sm font-semibold">
                                {todo.resultTitle}
                              </p>
                              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-6 text-stone-700">
                                {todo.resultBody}
                              </pre>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>

                    {row.communications.length > 0 ? (
                      <div className="mt-4 rounded-md border border-stone-200 bg-white p-3">
                        <h4 className="text-sm font-semibold">Inbox</h4>
                        <div className="mt-2 grid gap-2">
                          {row.communications.map((message) => (
                            <div
                              key={message._id}
                              className="rounded-md bg-stone-50 p-3 text-sm"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-medium">
                                  {message.direction === "outbound"
                                    ? "Sent"
                                    : "Received"}
                                  : {message.subject}
                                </span>
                                <span className="text-xs text-stone-500">
                                  {message.source}
                                </span>
                              </div>
                              <p className="mt-1 text-stone-600">
                                {message.summary ?? message.body}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-stone-950">{value}</p>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
      <p className="font-semibold text-stone-900">{title}</p>
      <p className="mt-1 text-sm text-stone-600">{body}</p>
    </div>
  );
}

function TodoButton({
  status,
  actionType,
  onRun,
  onSend,
}: {
  status: string;
  actionType: string;
  onRun: () => void;
  onSend: () => void;
}) {
  if (status === "done") {
    return (
      <span className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-50 px-3 text-sm font-semibold text-emerald-900">
        <CheckIcon />
        Done
      </span>
    );
  }
  if (status === "drafted" && actionType === "draft_email") {
    return (
      <button
        type="button"
        onClick={onSend}
        className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-800"
      >
        <EnvelopeClosedIcon />
        Approve/send
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onRun}
      className="inline-flex h-9 items-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-semibold text-white hover:bg-stone-800"
    >
      <LightningBoltIcon />
      Do it
    </button>
  );
}

function Timeline({
  events,
}: {
  events: Array<{
    _id: string;
    kind: string;
    title: string;
    body: string;
    createdAt: number;
  }>;
}) {
  return (
    <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Live timeline</h2>
      <div className="mt-3 grid gap-2">
        {events.length === 0 ? (
          <p className="text-sm text-stone-600">
            Search, ranking, todo, and email events appear here.
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="rounded-md border border-stone-200 bg-stone-50 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{event.title}</p>
                <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold uppercase text-stone-500">
                  {event.kind}
                </span>
              </div>
              <p className="mt-1 text-sm text-stone-600">{event.body}</p>
              <p className="mt-2 text-xs text-stone-500">
                {new Date(event.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function parseTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${mins.toString().padStart(2, "0")} ${suffix}`;
}

function labelForFactor(
  factors: ReadonlyArray<{ key: string; label: string }>,
  key: string,
) {
  return factors.find((factor) => factor.key === key)?.label ?? key;
}
