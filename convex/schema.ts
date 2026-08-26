import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    author: v.string(),
    body: v.string(),
  }),

  searches: defineTable({
    address: v.string(),
    grade: v.string(),
    preferredLeaveTimeMinutes: v.number(),
    maxCommuteMinutes: v.number(),
    dropoffBufferMinutes: v.number(),
    selectedFactors: v.array(
      v.object({
        key: v.string(),
        weight: v.number(),
      }),
    ),
    status: v.string(),
    scenarioName: v.optional(v.string()),
    districtName: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  schools: defineTable({
    key: v.string(),
    name: v.string(),
    schoolType: v.string(),
    districtName: v.string(),
    address: v.string(),
    gradesServed: v.array(v.string()),
    websiteUrl: v.string(),
    admissionsUrl: v.string(),
    startTimeMinutes: v.number(),
    endTimeMinutes: v.number(),
    sourceNote: v.string(),
    updatedAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_districtName", ["districtName"]),

  schoolSources: defineTable({
    searchId: v.id("searches"),
    schoolId: v.id("schools"),
    title: v.string(),
    url: v.string(),
    kind: v.string(),
    summary: v.string(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_searchId", ["searchId"])
    .index("by_schoolId", ["schoolId"])
    .index("by_searchId_and_schoolId", ["searchId", "schoolId"]),

  commuteEstimates: defineTable({
    searchId: v.id("searches"),
    schoolId: v.id("schools"),
    durationMinutes: v.number(),
    departureMinutes: v.number(),
    arrivalMinutes: v.number(),
    arrivalBufferMinutes: v.number(),
    workable: v.boolean(),
    source: v.string(),
    createdAt: v.number(),
  })
    .index("by_searchId", ["searchId"])
    .index("by_searchId_and_schoolId", ["searchId", "schoolId"]),

  schoolFactorScores: defineTable({
    searchId: v.id("searches"),
    schoolId: v.id("schools"),
    factorKey: v.string(),
    score: v.number(),
    confidence: v.string(),
    evidence: v.string(),
    sourceUrl: v.string(),
    createdAt: v.number(),
  })
    .index("by_searchId", ["searchId"])
    .index("by_searchId_and_schoolId", ["searchId", "schoolId"])
    .index("by_searchId_and_schoolId_and_factorKey", [
      "searchId",
      "schoolId",
      "factorKey",
    ]),

  rankings: defineTable({
    searchId: v.id("searches"),
    schoolId: v.id("schools"),
    aiRank: v.number(),
    parentRank: v.number(),
    weightedScore: v.number(),
    shortlisted: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_searchId", ["searchId"])
    .index("by_searchId_and_schoolId", ["searchId", "schoolId"]),

  applications: defineTable({
    searchId: v.id("searches"),
    schoolId: v.optional(v.id("schools")),
    title: v.string(),
    track: v.string(),
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_searchId", ["searchId"]),

  todos: defineTable({
    searchId: v.id("searches"),
    applicationId: v.id("applications"),
    schoolId: v.optional(v.id("schools")),
    title: v.string(),
    actionType: v.string(),
    status: v.string(),
    dueLabel: v.string(),
    sourceLinks: v.array(v.string()),
    resultTitle: v.optional(v.string()),
    resultBody: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_searchId", ["searchId"])
    .index("by_applicationId", ["applicationId"])
    .index("by_searchId_and_status", ["searchId", "status"]),

  communications: defineTable({
    searchId: v.id("searches"),
    applicationId: v.id("applications"),
    schoolId: v.optional(v.id("schools")),
    direction: v.string(),
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    summary: v.optional(v.string()),
    source: v.string(),
    createdAt: v.number(),
  })
    .index("by_searchId", ["searchId"])
    .index("by_applicationId", ["applicationId"])
    .index("by_searchId_and_createdAt", ["searchId", "createdAt"]),

  timelineEvents: defineTable({
    searchId: v.id("searches"),
    kind: v.string(),
    title: v.string(),
    body: v.string(),
    createdAt: v.number(),
  })
    .index("by_searchId", ["searchId"])
    .index("by_searchId_and_createdAt", ["searchId", "createdAt"]),

  artifacts: defineTable({
    searchId: v.id("searches"),
    todoId: v.optional(v.id("todos")),
    title: v.string(),
    body: v.string(),
    kind: v.string(),
    createdAt: v.number(),
  })
    .index("by_searchId", ["searchId"])
    .index("by_todoId", ["todoId"]),
});
