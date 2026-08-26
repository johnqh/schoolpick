import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

const DISTRICT_NAME = "San Francisco Unified School District";

const factorDefinitions = [
  {
    key: "commute_fit",
    label: "Commute fit",
    description: "Morning drive time, arrival buffer, and daily routine fit.",
  },
  {
    key: "after_school",
    label: "After-school care",
    description: "Programs that cover the afternoon gap for working parents.",
  },
  {
    key: "language_immersion",
    label: "Language immersion",
    description: "Bilingual or immersion programs and language pathway fit.",
  },
  {
    key: "academics",
    label: "Academics",
    description: "Academic program strength, enrichment, and preparation.",
  },
  {
    key: "school_size",
    label: "School size",
    description: "Enrollment scale, classroom feel, and community size.",
  },
  {
    key: "arts_music",
    label: "Arts and music",
    description: "Visual arts, music, performance, and creative opportunities.",
  },
  {
    key: "stem",
    label: "STEM",
    description: "Science, technology, engineering, and math opportunities.",
  },
  {
    key: "support_services",
    label: "Support services",
    description: "Learning support, counseling, and student services.",
  },
  {
    key: "tuition_aid",
    label: "Tuition and aid",
    description: "Private-school cost transparency and financial aid fit.",
  },
  {
    key: "application_simplicity",
    label: "Application simplicity",
    description: "How clear and manageable the admissions process appears.",
  },
] as const;

type FactorKey = (typeof factorDefinitions)[number]["key"];

type SeedScore = {
  score: number;
  confidence: "high" | "medium" | "low";
  evidence: string;
};

type SeedSchool = {
  key: string;
  name: string;
  schoolType: "Public" | "Public language pathway" | "Private";
  districtName: string;
  address: string;
  gradesServed: string[];
  websiteUrl: string;
  admissionsUrl: string;
  startTimeMinutes: number;
  endTimeMinutes: number;
  commuteMinutes: number;
  sourceNote: string;
  sourceSummary: string;
  scores: Partial<Record<FactorKey, SeedScore>>;
};

type SelectedFactor = {
  key: string;
  weight: number;
};

const seedSchools: SeedSchool[] = [
  {
    key: "clarendon",
    name: "Clarendon Elementary School",
    schoolType: "Public",
    districtName: DISTRICT_NAME,
    address: "500 Clarendon Ave, San Francisco, CA",
    gradesServed: ["K", "1", "2", "3", "4", "5"],
    websiteUrl: "https://www.sfusd.edu/school/clarendon-elementary-school",
    admissionsUrl: "https://www.sfusd.edu/schools/enroll",
    startTimeMinutes: 470,
    endTimeMinutes: 860,
    commuteMinutes: 16,
    sourceNote: "Seeded from planned SFUSD public sources for demo reliability.",
    sourceSummary:
      "SFUSD elementary option with a known public profile and district enrollment path.",
    scores: {
      academics: {
        score: 4.3,
        confidence: "medium",
        evidence:
          "The district profile and school program materials describe a structured elementary program with enrichment options.",
      },
      after_school: {
        score: 3.8,
        confidence: "medium",
        evidence:
          "After-school fit is plausible for SFUSD elementary programs, but provider details should be verified.",
      },
      school_size: {
        score: 3.6,
        confidence: "medium",
        evidence:
          "The school is large enough to offer broad programming while remaining elementary-focused.",
      },
      application_simplicity: {
        score: 3.4,
        confidence: "high",
        evidence:
          "The school follows the central SFUSD enrollment process rather than a separate private application.",
      },
      arts_music: {
        score: 3.7,
        confidence: "medium",
        evidence:
          "Public school enrichment materials mention arts exposure, though depth varies by year.",
      },
    },
  },
  {
    key: "de-avila",
    name: "Chinese Immersion School at De Avila",
    schoolType: "Public language pathway",
    districtName: DISTRICT_NAME,
    address: "1250 Waller St, San Francisco, CA",
    gradesServed: ["K", "1", "2", "3", "4", "5"],
    websiteUrl:
      "https://www.sfusd.edu/school/chinese-immersion-school-de-avila",
    admissionsUrl: "https://www.sfusd.edu/schools/enroll",
    startTimeMinutes: 465,
    endTimeMinutes: 855,
    commuteMinutes: 11,
    sourceNote: "Seeded from planned SFUSD public sources for demo reliability.",
    sourceSummary:
      "SFUSD elementary option with a Chinese immersion pathway and central district application.",
    scores: {
      language_immersion: {
        score: 5,
        confidence: "high",
        evidence:
          "The school is explicitly structured around a Chinese immersion pathway.",
      },
      academics: {
        score: 4.1,
        confidence: "medium",
        evidence:
          "Program materials emphasize bilingual academic development across elementary grades.",
      },
      after_school: {
        score: 3.4,
        confidence: "low",
        evidence:
          "After-school details need current provider confirmation from the school or district.",
      },
      application_simplicity: {
        score: 3.2,
        confidence: "medium",
        evidence:
          "The central SFUSD process is straightforward, but language pathway demand can affect assignment odds.",
      },
      school_size: {
        score: 3.8,
        confidence: "medium",
        evidence:
          "The school is focused around a specialized pathway, which can support a clearer community identity.",
      },
    },
  },
  {
    key: "alice-fong-yu",
    name: "Alice Fong Yu Alternative School",
    schoolType: "Public language pathway",
    districtName: DISTRICT_NAME,
    address: "1541 12th Ave, San Francisco, CA",
    gradesServed: ["K", "1", "2", "3", "4", "5", "6", "7", "8"],
    websiteUrl:
      "https://www.sfusd.edu/school/alice-fong-yu-alternative-school",
    admissionsUrl: "https://www.sfusd.edu/schools/enroll",
    startTimeMinutes: 475,
    endTimeMinutes: 880,
    commuteMinutes: 8,
    sourceNote: "Seeded from planned SFUSD public sources for demo reliability.",
    sourceSummary:
      "K-8 SFUSD alternative school with Chinese language pathway and a district enrollment path.",
    scores: {
      language_immersion: {
        score: 5,
        confidence: "high",
        evidence:
          "The school profile centers on a Chinese language pathway across elementary and middle grades.",
      },
      academics: {
        score: 4.4,
        confidence: "medium",
        evidence:
          "The K-8 pathway can provide continuity across grades and sustained academic programming.",
      },
      school_size: {
        score: 3.5,
        confidence: "medium",
        evidence:
          "The K-8 model creates continuity but may feel larger than a single-span elementary school.",
      },
      after_school: {
        score: 3.6,
        confidence: "low",
        evidence:
          "After-school details should be confirmed because availability can vary by provider and grade.",
      },
      application_simplicity: {
        score: 3.1,
        confidence: "medium",
        evidence:
          "SFUSD central enrollment applies, but high-demand alternative programs can require careful ranking.",
      },
    },
  },
  {
    key: "lawton",
    name: "Lawton Alternative School",
    schoolType: "Public",
    districtName: DISTRICT_NAME,
    address: "1570 31st Ave, San Francisco, CA",
    gradesServed: ["K", "1", "2", "3", "4", "5", "6", "7", "8"],
    websiteUrl: "https://www.sfusd.edu/school/lawton-alternative-school",
    admissionsUrl: "https://www.sfusd.edu/schools/enroll",
    startTimeMinutes: 480,
    endTimeMinutes: 890,
    commuteMinutes: 18,
    sourceNote: "Seeded from planned SFUSD public sources for demo reliability.",
    sourceSummary:
      "K-8 SFUSD alternative school in the Sunset with district enrollment.",
    scores: {
      academics: {
        score: 4,
        confidence: "medium",
        evidence:
          "The K-8 alternative structure supports continuity from elementary into middle grades.",
      },
      school_size: {
        score: 3.7,
        confidence: "medium",
        evidence:
          "The school serves multiple grade bands, which can help continuity while increasing campus scale.",
      },
      application_simplicity: {
        score: 3.4,
        confidence: "high",
        evidence:
          "The application path uses the central SFUSD enrollment process.",
      },
      after_school: {
        score: 3.2,
        confidence: "low",
        evidence:
          "After-school specifics need verification from current school materials.",
      },
      support_services: {
        score: 3.5,
        confidence: "medium",
        evidence:
          "As an SFUSD school, student services flow through district support structures.",
      },
    },
  },
  {
    key: "hoover",
    name: "Herbert Hoover Middle School",
    schoolType: "Public",
    districtName: DISTRICT_NAME,
    address: "2290 14th Ave, San Francisco, CA",
    gradesServed: ["6", "7", "8"],
    websiteUrl: "https://www.sfusd.edu/school/herbert-hoover-middle-school",
    admissionsUrl: "https://www.sfusd.edu/schools/enroll",
    startTimeMinutes: 500,
    endTimeMinutes: 910,
    commuteMinutes: 12,
    sourceNote: "Seeded from planned SFUSD public sources for demo reliability.",
    sourceSummary:
      "SFUSD middle school option with a central enrollment process and west-side commute profile.",
    scores: {
      academics: {
        score: 4.1,
        confidence: "medium",
        evidence:
          "The school profile presents a dedicated middle school academic program.",
      },
      stem: {
        score: 4,
        confidence: "medium",
        evidence:
          "Middle school course programming supports dedicated math and science pathways.",
      },
      arts_music: {
        score: 3.6,
        confidence: "medium",
        evidence:
          "Elective and enrichment offerings are expected for a dedicated middle school, but current offerings should be verified.",
      },
      support_services: {
        score: 3.8,
        confidence: "medium",
        evidence:
          "Dedicated middle schools typically publish student support and counseling structures through SFUSD.",
      },
      application_simplicity: {
        score: 3.6,
        confidence: "high",
        evidence:
          "The application path uses SFUSD's central process for middle school assignment.",
      },
    },
  },
  {
    key: "presidio",
    name: "Presidio Middle School",
    schoolType: "Public",
    districtName: DISTRICT_NAME,
    address: "450 30th Ave, San Francisco, CA",
    gradesServed: ["6", "7", "8"],
    websiteUrl: "https://www.sfusd.edu/school/presidio-middle-school",
    admissionsUrl: "https://www.sfusd.edu/schools/enroll",
    startTimeMinutes: 495,
    endTimeMinutes: 905,
    commuteMinutes: 19,
    sourceNote: "Seeded from planned SFUSD public sources for demo reliability.",
    sourceSummary:
      "SFUSD middle school option near the Richmond and Presidio areas.",
    scores: {
      academics: {
        score: 4,
        confidence: "medium",
        evidence:
          "The school profile presents a full middle school program across grades 6 to 8.",
      },
      arts_music: {
        score: 3.9,
        confidence: "medium",
        evidence:
          "Middle school electives can support arts and music exploration; current offerings should be verified.",
      },
      school_size: {
        score: 3.4,
        confidence: "medium",
        evidence:
          "The dedicated middle school model offers broad programming but may feel larger than a K-8 option.",
      },
      support_services: {
        score: 3.8,
        confidence: "medium",
        evidence:
          "SFUSD middle schools provide grade-level and student support structures.",
      },
      application_simplicity: {
        score: 3.6,
        confidence: "high",
        evidence:
          "The application path uses SFUSD's central enrollment process.",
      },
    },
  },
  {
    key: "sf-day",
    name: "San Francisco Day School",
    schoolType: "Private",
    districtName: "Independent",
    address: "350 Masonic Ave, San Francisco, CA",
    gradesServed: ["K", "1", "2", "3", "4", "5", "6", "7", "8"],
    websiteUrl: "https://www.sfday.org/",
    admissionsUrl: "https://www.sfday.org/admission",
    startTimeMinutes: 500,
    endTimeMinutes: 900,
    commuteMinutes: 13,
    sourceNote: "Seeded from public private-school website planning notes.",
    sourceSummary:
      "Independent K-8 school with a separate admissions path and parent inquiry workflow.",
    scores: {
      academics: {
        score: 4.5,
        confidence: "medium",
        evidence:
          "The school's public materials emphasize independent-school academics and a K-8 program.",
      },
      after_school: {
        score: 4.2,
        confidence: "medium",
        evidence:
          "Independent-school schedules often publish extended-day or enrichment options that should be verified during inquiry.",
      },
      arts_music: {
        score: 4,
        confidence: "medium",
        evidence:
          "Public materials emphasize broad enrichment and creative development.",
      },
      tuition_aid: {
        score: 2.7,
        confidence: "medium",
        evidence:
          "Private-school tuition and financial aid details require a separate admissions review.",
      },
      application_simplicity: {
        score: 2.6,
        confidence: "high",
        evidence:
          "A private-school application requires school-specific forms, tour steps, and deadlines.",
      },
    },
  },
  {
    key: "live-oak",
    name: "Live Oak School",
    schoolType: "Private",
    districtName: "Independent",
    address: "1555 Mariposa St, San Francisco, CA",
    gradesServed: ["K", "1", "2", "3", "4", "5", "6", "7", "8"],
    websiteUrl: "https://www.liveoaksf.org/",
    admissionsUrl: "https://www.liveoaksf.org/admissions",
    startTimeMinutes: 505,
    endTimeMinutes: 900,
    commuteMinutes: 24,
    sourceNote: "Seeded from public private-school website planning notes.",
    sourceSummary:
      "Independent K-8 school with a school-specific admissions and inquiry process.",
    scores: {
      academics: {
        score: 4.2,
        confidence: "medium",
        evidence:
          "The school's public materials emphasize progressive academics and a K-8 pathway.",
      },
      arts_music: {
        score: 4.1,
        confidence: "medium",
        evidence:
          "Public program descriptions emphasize creative development and enrichment.",
      },
      school_size: {
        score: 4,
        confidence: "medium",
        evidence:
          "The independent K-8 model suggests a more contained community than larger public middle schools.",
      },
      tuition_aid: {
        score: 2.8,
        confidence: "medium",
        evidence:
          "Tuition and aid details require reviewing admissions materials and contacting the school.",
      },
      application_simplicity: {
        score: 2.5,
        confidence: "high",
        evidence:
          "A private-school application requires separate school-specific steps.",
      },
    },
  },
  {
    key: "lick-wilmerding",
    name: "Lick-Wilmerding High School",
    schoolType: "Private",
    districtName: "Independent",
    address: "755 Ocean Ave, San Francisco, CA",
    gradesServed: ["9", "10", "11", "12"],
    websiteUrl: "https://www.lwhs.org/",
    admissionsUrl: "https://www.lwhs.org/admissions",
    startTimeMinutes: 510,
    endTimeMinutes: 930,
    commuteMinutes: 21,
    sourceNote: "Seeded from public private-school website planning notes.",
    sourceSummary:
      "Independent high school with a separate admissions process and strong applied learning identity.",
    scores: {
      academics: {
        score: 4.6,
        confidence: "medium",
        evidence:
          "The school publicly emphasizes rigorous academics and applied learning.",
      },
      stem: {
        score: 4.7,
        confidence: "medium",
        evidence:
          "Public materials emphasize technical arts and applied science opportunities.",
      },
      arts_music: {
        score: 4.2,
        confidence: "medium",
        evidence:
          "The school describes creative and technical arts as part of its program identity.",
      },
      tuition_aid: {
        score: 3.4,
        confidence: "medium",
        evidence:
          "Financial aid should be evaluated through the school's admissions materials.",
      },
      application_simplicity: {
        score: 2.4,
        confidence: "high",
        evidence:
          "The private high school process requires school-specific forms, dates, and materials.",
      },
    },
  },
  {
    key: "lowell",
    name: "Lowell High School",
    schoolType: "Public",
    districtName: DISTRICT_NAME,
    address: "1101 Eucalyptus Dr, San Francisco, CA",
    gradesServed: ["9", "10", "11", "12"],
    websiteUrl: "https://www.sfusd.edu/school/lowell-high-school",
    admissionsUrl: "https://www.sfusd.edu/schools/enroll",
    startTimeMinutes: 500,
    endTimeMinutes: 930,
    commuteMinutes: 17,
    sourceNote: "Seeded from planned SFUSD public sources for demo reliability.",
    sourceSummary:
      "SFUSD high school option with a central enrollment path and broad course offerings.",
    scores: {
      academics: {
        score: 4.7,
        confidence: "medium",
        evidence:
          "The school profile emphasizes a broad high school academic program and course depth.",
      },
      stem: {
        score: 4.4,
        confidence: "medium",
        evidence:
          "Large high schools generally offer broader math and science course sequences.",
      },
      arts_music: {
        score: 3.8,
        confidence: "medium",
        evidence:
          "Course breadth can support arts options, but current course catalogs should be checked.",
      },
      application_simplicity: {
        score: 3.3,
        confidence: "medium",
        evidence:
          "The SFUSD process is centralized, though high school assignment rules and demand require careful ranking.",
      },
      support_services: {
        score: 3.9,
        confidence: "medium",
        evidence:
          "Public high schools publish counseling and student support resources through SFUSD.",
      },
    },
  },
];

const defaultSelectedFactors = [
  { key: "commute_fit", weight: 2 },
  { key: "after_school", weight: 1 },
  { key: "language_immersion", weight: 1 },
  { key: "academics", weight: 2 },
  { key: "school_size", weight: 1 },
  { key: "application_simplicity", weight: 1 },
];

export const listFactorDefinitions = query({
  args: {},
  handler: async () => {
    return factorDefinitions;
  },
});

export const getSearch = query({
  args: { searchId: v.id("searches") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.searchId);
  },
});

export const latestSearch = query({
  args: {},
  handler: async (ctx) => {
    const searches = await ctx.db
      .query("searches")
      .withIndex("by_createdAt")
      .order("desc")
      .take(1);
    return searches[0] ?? null;
  },
});

export const listRankedSchools = query({
  args: { searchId: v.id("searches") },
  handler: async (ctx, args) => {
    const rankings = await ctx.db
      .query("rankings")
      .withIndex("by_searchId", (q) => q.eq("searchId", args.searchId))
      .take(50);

    const rows = [];
    for (const ranking of rankings) {
      const school = await ctx.db.get(ranking.schoolId);
      if (!school) {
        continue;
      }
      const commute = await ctx.db
        .query("commuteEstimates")
        .withIndex("by_searchId_and_schoolId", (q) =>
          q.eq("searchId", args.searchId).eq("schoolId", school._id),
        )
        .unique();
      const scores = await ctx.db
        .query("schoolFactorScores")
        .withIndex("by_searchId_and_schoolId", (q) =>
          q.eq("searchId", args.searchId).eq("schoolId", school._id),
        )
        .take(20);
      const sources = await ctx.db
        .query("schoolSources")
        .withIndex("by_searchId_and_schoolId", (q) =>
          q.eq("searchId", args.searchId).eq("schoolId", school._id),
        )
        .take(5);
      rows.push({ school, ranking, commute, scores, sources });
    }

    return rows.sort((a, b) => a.ranking.parentRank - b.ranking.parentRank);
  },
});

export const listApplications = query({
  args: { searchId: v.id("searches") },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_searchId", (q) => q.eq("searchId", args.searchId))
      .take(20);

    const rows = [];
    for (const application of applications) {
      const school = application.schoolId
        ? await ctx.db.get(application.schoolId)
        : null;
      const todos = await ctx.db
        .query("todos")
        .withIndex("by_applicationId", (q) =>
          q.eq("applicationId", application._id),
        )
        .take(20);
      const communications = await ctx.db
        .query("communications")
        .withIndex("by_applicationId", (q) =>
          q.eq("applicationId", application._id),
        )
        .order("desc")
        .take(10);
      rows.push({
        application,
        school,
        todos: todos.sort((a, b) => a._creationTime - b._creationTime),
        communications: communications.reverse(),
      });
    }

    return rows.sort(
      (a, b) => a.application._creationTime - b.application._creationTime,
    );
  },
});

export const listTimeline = query({
  args: { searchId: v.id("searches") },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("timelineEvents")
      .withIndex("by_searchId_and_createdAt", (q) =>
        q.eq("searchId", args.searchId),
      )
      .order("desc")
      .take(50);
    return events.reverse();
  },
});

export const startSearch = mutation({
  args: {
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
    scenarioName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await createSearchFromSeed(ctx, args);
  },
});

export const startDemoSearch = mutation({
  args: {},
  handler: async (ctx) => {
    return await createSearchFromSeed(ctx, {
      address: "Inner Sunset, San Francisco, CA",
      grade: "K",
      preferredLeaveTimeMinutes: 455,
      maxCommuteMinutes: 25,
      dropoffBufferMinutes: 10,
      selectedFactors: defaultSelectedFactors,
      scenarioName: "Demo family: kindergarten search",
    });
  },
});

export const toggleShortlist = mutation({
  args: {
    searchId: v.id("searches"),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    const ranking = await ctx.db
      .query("rankings")
      .withIndex("by_searchId_and_schoolId", (q) =>
        q.eq("searchId", args.searchId).eq("schoolId", args.schoolId),
      )
      .unique();
    if (!ranking) {
      return null;
    }
    await ctx.db.patch(ranking._id, {
      shortlisted: !ranking.shortlisted,
      updatedAt: Date.now(),
    });
    const school = await ctx.db.get(args.schoolId);
    await addTimeline(
      ctx,
      args.searchId,
      "ranking",
      ranking.shortlisted ? "Removed from shortlist" : "Added to shortlist",
      school ? school.name : "School ranking changed",
    );
    return ranking._id;
  },
});

export const moveRanking = mutation({
  args: {
    searchId: v.id("searches"),
    schoolId: v.id("schools"),
    direction: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const rankings = await ctx.db
      .query("rankings")
      .withIndex("by_searchId", (q) => q.eq("searchId", args.searchId))
      .take(50);
    const ordered = rankings.sort((a, b) => a.parentRank - b.parentRank);
    const index = ordered.findIndex((item) => item.schoolId === args.schoolId);
    if (index === -1) {
      return null;
    }
    const swapIndex = args.direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= ordered.length) {
      return null;
    }
    const now = Date.now();
    const current = ordered[index];
    const other = ordered[swapIndex];
    await ctx.db.patch(current._id, {
      parentRank: other.parentRank,
      updatedAt: now,
    });
    await ctx.db.patch(other._id, {
      parentRank: current.parentRank,
      updatedAt: now,
    });
    const school = await ctx.db.get(args.schoolId);
    await addTimeline(
      ctx,
      args.searchId,
      "ranking",
      "Preference order changed",
      school
        ? `${school.name} moved ${args.direction}.`
        : `A school moved ${args.direction}.`,
    );
    return current._id;
  },
});

export const createApplicationPlan = mutation({
  args: { searchId: v.id("searches") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("applications")
      .withIndex("by_searchId", (q) => q.eq("searchId", args.searchId))
      .take(1);
    if (existing.length > 0) {
      return existing[0]._id;
    }

    const now = Date.now();
    const rankings = await ctx.db
      .query("rankings")
      .withIndex("by_searchId", (q) => q.eq("searchId", args.searchId))
      .take(50);
    const selected = rankings
      .filter((ranking) => ranking.shortlisted)
      .sort((a, b) => a.parentRank - b.parentRank)
      .slice(0, 5);

    const schools = [];
    for (const ranking of selected) {
      const school = await ctx.db.get(ranking.schoolId);
      if (school) {
        schools.push({ school, ranking });
      }
    }

    const publicSchools = schools.filter(
      ({ school }) => school.schoolType !== "Private",
    );
    let firstApplicationId: Id<"applications"> | null = null;

    if (publicSchools.length > 0) {
      const applicationId = await ctx.db.insert("applications", {
        searchId: args.searchId,
        title: "SFUSD ranked-choice application",
        track: "public",
        status: "active",
        createdAt: now,
        updatedAt: now,
      });
      firstApplicationId = applicationId;
      await insertTodo(ctx, {
        searchId: args.searchId,
        applicationId,
        title: "Build ranked-choice list",
        actionType: "build_ranked_list",
        dueLabel: "Before district application deadline",
        sourceLinks: ["https://www.sfusd.edu/schools/enroll"],
      });
      await insertTodo(ctx, {
        searchId: args.searchId,
        applicationId,
        title: "Prepare SFUSD document checklist",
        actionType: "prepare_document_checklist",
        dueLabel: "This week",
        sourceLinks: ["https://www.sfusd.edu/schools/enroll"],
      });
      await insertTodo(ctx, {
        searchId: args.searchId,
        applicationId,
        title: "Draft enrollment office questions",
        actionType: "draft_email",
        dueLabel: "Today",
        sourceLinks: ["https://www.sfusd.edu/schools/enroll"],
      });
      await insertTodo(ctx, {
        searchId: args.searchId,
        applicationId,
        title: "Open final district portal handoff",
        actionType: "handoff_to_portal",
        dueLabel: "After preference list is reviewed",
        sourceLinks: ["https://www.sfusd.edu/schools/enroll"],
      });
    }

    for (const { school } of schools.filter(
      (item) => item.school.schoolType === "Private",
    )) {
      const applicationId = await ctx.db.insert("applications", {
        searchId: args.searchId,
        schoolId: school._id,
        title: `${school.name} application`,
        track: "private",
        status: "active",
        createdAt: now,
        updatedAt: now,
      });
      firstApplicationId ??= applicationId;
      await insertTodo(ctx, {
        searchId: args.searchId,
        applicationId,
        schoolId: school._id,
        title: "Request admissions tour",
        actionType: "draft_email",
        dueLabel: "Today",
        sourceLinks: [school.admissionsUrl],
      });
      await insertTodo(ctx, {
        searchId: args.searchId,
        applicationId,
        schoolId: school._id,
        title: "Prepare private-school checklist",
        actionType: "prepare_document_checklist",
        dueLabel: "This week",
        sourceLinks: [school.admissionsUrl],
      });
      await insertTodo(ctx, {
        searchId: args.searchId,
        applicationId,
        schoolId: school._id,
        title: "Draft parent statement outline",
        actionType: "draft_parent_statement",
        dueLabel: "Before application opens",
        sourceLinks: [school.admissionsUrl],
      });
    }

    await addTimeline(
      ctx,
      args.searchId,
      "application",
      "Application plan created",
      `${schools.length} shortlisted schools were converted into actionable todos.`,
    );
    return firstApplicationId;
  },
});

export const runTodoAction = mutation({
  args: { todoId: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.todoId);
    if (!todo) {
      return null;
    }
    const application = await ctx.db.get(todo.applicationId);
    if (!application) {
      return null;
    }
    const search = await ctx.db.get(todo.searchId);
    if (!search) {
      return null;
    }
    const school = todo.schoolId ? await ctx.db.get(todo.schoolId) : null;
    const now = Date.now();
    const result = await buildTodoResult(ctx, todo.actionType, {
      searchId: todo.searchId,
      schoolId: todo.schoolId,
      applicationTitle: application.title,
      schoolName: school?.name ?? "SFUSD schools",
    });
    const nextStatus = todo.actionType === "draft_email" ? "drafted" : "done";
    await ctx.db.patch(todo._id, {
      status: nextStatus,
      resultTitle: result.title,
      resultBody: result.body,
      updatedAt: now,
    });
    await ctx.db.insert("artifacts", {
      searchId: todo.searchId,
      todoId: todo._id,
      title: result.title,
      body: result.body,
      kind: todo.actionType,
      createdAt: now,
    });
    await addTimeline(
      ctx,
      todo.searchId,
      "todo",
      nextStatus === "drafted" ? "Todo drafted" : "Todo completed",
      todo.title,
    );
    return todo._id;
  },
});

export const sendDraftEmail = mutation({
  args: { todoId: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.todoId);
    if (!todo) {
      return null;
    }
    const application = await ctx.db.get(todo.applicationId);
    if (!application) {
      return null;
    }
    const school = todo.schoolId ? await ctx.db.get(todo.schoolId) : null;
    const now = Date.now();
    const recipient =
      application.track === "public"
        ? "enrollment-demo@schoolpick.local"
        : "admissions-demo@schoolpick.local";
    const subject =
      application.track === "public"
        ? "Questions about SFUSD application fit"
        : `Tour and admissions questions for ${school?.name ?? application.title}`;
    const body =
      todo.resultBody ??
      `Hello, I am comparing schools for my child and have questions about ${application.title}.`;
    await ctx.db.insert("communications", {
      searchId: todo.searchId,
      applicationId: todo.applicationId,
      schoolId: todo.schoolId,
      direction: "outbound",
      from: "parent-demo@schoolpick.local",
      to: recipient,
      subject,
      body,
      summary: "Demo outbound message generated from a SchoolPick todo.",
      source: "AgentMail demo send",
      createdAt: now,
    });
    await ctx.db.insert("communications", {
      searchId: todo.searchId,
      applicationId: todo.applicationId,
      schoolId: todo.schoolId,
      direction: "inbound",
      from: recipient,
      to: "parent-demo@schoolpick.local",
      subject: `Re: ${subject}`,
      body:
        application.track === "public"
          ? "Thanks for reaching out. Families should rank schools in true preference order and prepare proof of address plus the child's birth record before submitting the district application."
          : "Thanks for your interest. Please request a tour, review the grade-specific checklist, and watch for parent statement and recommendation deadlines.",
      summary:
        application.track === "public"
          ? "Enrollment office reply confirms ranked-choice order and core documents."
          : "Admissions reply confirms tour request and school-specific checklist steps.",
      source: "AgentMail demo reply",
      createdAt: now + 1,
    });
    await ctx.db.patch(todo._id, {
      status: "done",
      resultTitle: "Email sent and demo reply received",
      resultBody:
        "SchoolPick sent the draft through the demo AgentMail path, received a simulated reply, summarized it, and added a follow-up review todo.",
      updatedAt: now,
    });
    await insertTodo(ctx, {
      searchId: todo.searchId,
      applicationId: todo.applicationId,
      schoolId: todo.schoolId,
      title: "Review admissions reply",
      actionType: "summarize_reply",
      dueLabel: "Next",
      sourceLinks: todo.sourceLinks,
    });
    await addTimeline(
      ctx,
      todo.searchId,
      "email",
      "Demo email loop completed",
      `${subject} was sent and a demo reply was summarized into the application timeline.`,
    );
    return todo._id;
  },
});

async function createSearchFromSeed(
  ctx: MutationCtx,
  args: {
    address: string;
    grade: string;
    preferredLeaveTimeMinutes: number;
    maxCommuteMinutes: number;
    dropoffBufferMinutes: number;
    selectedFactors: SelectedFactor[];
    scenarioName?: string;
  },
) {
  const now = Date.now();
  const selectedFactors =
    args.selectedFactors.length > 0
      ? args.selectedFactors
      : defaultSelectedFactors;

  const searchId = await ctx.db.insert("searches", {
    address: args.address.trim(),
    grade: args.grade,
    preferredLeaveTimeMinutes: args.preferredLeaveTimeMinutes,
    maxCommuteMinutes: args.maxCommuteMinutes,
    dropoffBufferMinutes: args.dropoffBufferMinutes,
    selectedFactors,
    status: "ranked",
    scenarioName: args.scenarioName,
    districtName: DISTRICT_NAME,
    createdAt: now,
    updatedAt: now,
  });

  await addTimeline(
    ctx,
    searchId,
    "search",
    "Search created",
    [
      `Grade ${args.grade}`,
      `${selectedFactors.length} priority factors`,
      `${args.maxCommuteMinutes} minute max commute`,
    ].join(" | "),
  );

  const candidateIds: Id<"schools">[] = [];
  for (const seedSchool of seedSchools) {
    if (!servesGrade(seedSchool, args.grade)) {
      continue;
    }
    const schoolId = await upsertSchool(ctx, seedSchool, now);
    candidateIds.push(schoolId);

    const commute = calculateCommute(args, seedSchool);
    await ctx.db.insert("commuteEstimates", {
      searchId,
      schoolId,
      ...commute,
      source: "Seeded commute estimate for demo mode",
      createdAt: now,
    });

    await ctx.db.insert("schoolSources", {
      searchId,
      schoolId,
      title: `${seedSchool.name} public profile`,
      url: seedSchool.websiteUrl,
      kind:
        seedSchool.schoolType === "Private" ? "school_site" : "district_profile",
      summary: seedSchool.sourceSummary,
      status: "cached_demo_source",
      createdAt: now,
    });

    for (const selectedFactor of selectedFactors) {
      const factorScore = getFactorScore(
        seedSchool,
        selectedFactor.key,
        commute,
      );
      await ctx.db.insert("schoolFactorScores", {
        searchId,
        schoolId,
        factorKey: selectedFactor.key,
        score: factorScore.score,
        confidence: factorScore.confidence,
        evidence: factorScore.evidence,
        sourceUrl: factorScore.sourceUrl,
        createdAt: now,
      });
    }
  }

  const scoredSchools = [];
  for (const schoolId of candidateIds) {
    const school = await ctx.db.get(schoolId);
    if (!school) {
      continue;
    }
    const seedSchool = seedSchools.find((item) => item.key === school.key);
    if (!seedSchool) {
      continue;
    }
    const commute = calculateCommute(args, seedSchool);
    scoredSchools.push({
      schoolId,
      weightedScore: calculateWeightedScore(
        seedSchool,
        selectedFactors,
        commute,
      ),
    });
  }

  scoredSchools.sort((a, b) => b.weightedScore - a.weightedScore);
  for (let index = 0; index < scoredSchools.length; index += 1) {
    await ctx.db.insert("rankings", {
      searchId,
      schoolId: scoredSchools[index].schoolId,
      aiRank: index + 1,
      parentRank: index + 1,
      weightedScore: scoredSchools[index].weightedScore,
      shortlisted: index < 3,
      createdAt: now,
      updatedAt: now,
    });
  }

  await addTimeline(
    ctx,
    searchId,
    "ranking",
    "Schools ranked",
    `${scoredSchools.length} schools matched grade ${args.grade}; top 3 were shortlisted for the application plan.`,
  );

  return searchId;
}

async function upsertSchool(
  ctx: MutationCtx,
  seedSchool: SeedSchool,
  now: number,
) {
  const existing = await ctx.db
    .query("schools")
    .withIndex("by_key", (q) => q.eq("key", seedSchool.key))
    .unique();
  const fields = {
    key: seedSchool.key,
    name: seedSchool.name,
    schoolType: seedSchool.schoolType,
    districtName: seedSchool.districtName,
    address: seedSchool.address,
    gradesServed: seedSchool.gradesServed,
    websiteUrl: seedSchool.websiteUrl,
    admissionsUrl: seedSchool.admissionsUrl,
    startTimeMinutes: seedSchool.startTimeMinutes,
    endTimeMinutes: seedSchool.endTimeMinutes,
    sourceNote: seedSchool.sourceNote,
    updatedAt: now,
  };
  if (existing) {
    await ctx.db.patch(existing._id, fields);
    return existing._id;
  }
  return await ctx.db.insert("schools", fields);
}

function servesGrade(seedSchool: SeedSchool, grade: string) {
  return seedSchool.gradesServed.includes(grade);
}

function calculateCommute(
  args: {
    preferredLeaveTimeMinutes: number;
    dropoffBufferMinutes: number;
  },
  seedSchool: SeedSchool,
) {
  const durationMinutes = seedSchool.commuteMinutes;
  const departureMinutes = args.preferredLeaveTimeMinutes;
  const arrivalMinutes = departureMinutes + durationMinutes;
  const arrivalBufferMinutes =
    seedSchool.startTimeMinutes - arrivalMinutes - args.dropoffBufferMinutes;
  return {
    durationMinutes,
    departureMinutes,
    arrivalMinutes,
    arrivalBufferMinutes,
    workable: arrivalBufferMinutes >= 0,
  };
}

function getFactorScore(
  seedSchool: SeedSchool,
  factorKey: string,
  commute: ReturnType<typeof calculateCommute>,
) {
  if (factorKey === "commute_fit") {
    const score = commute.workable
      ? Math.min(5, Math.max(2.5, 3 + commute.arrivalBufferMinutes / 10))
      : Math.max(1, 2 + commute.arrivalBufferMinutes / 15);
    return {
      score: roundScore(score),
      confidence: "high",
      evidence: commute.workable
        ? `The seeded morning drive is ${commute.durationMinutes} minutes and leaves ${commute.arrivalBufferMinutes} minutes after dropoff buffer.`
        : `The seeded morning drive is ${commute.durationMinutes} minutes, which misses the requested arrival buffer by ${Math.abs(
            commute.arrivalBufferMinutes,
          )} minutes.`,
      sourceUrl: "demo://commute-estimate",
    };
  }
  const score = seedSchool.scores[factorKey as FactorKey];
  if (score) {
    return {
      ...score,
      sourceUrl: seedSchool.websiteUrl,
    };
  }
  return {
    score: 2.5,
    confidence: "low",
    evidence:
      "The seeded source profile does not contain enough evidence for this factor yet.",
    sourceUrl: seedSchool.websiteUrl,
  };
}

function calculateWeightedScore(
  seedSchool: SeedSchool,
  selectedFactors: SelectedFactor[],
  commute: ReturnType<typeof calculateCommute>,
) {
  const totalWeight = selectedFactors.reduce(
    (sum, factor) => sum + factor.weight,
    0,
  );
  if (totalWeight === 0) {
    return 0;
  }
  const weightedTotal = selectedFactors.reduce((sum, factor) => {
    const factorScore = getFactorScore(seedSchool, factor.key, commute);
    return sum + factorScore.score * factor.weight;
  }, 0);
  return roundScore(weightedTotal / totalWeight);
}

function roundScore(score: number) {
  return Math.round(score * 10) / 10;
}

async function addTimeline(
  ctx: MutationCtx,
  searchId: Id<"searches">,
  kind: string,
  title: string,
  body: string,
) {
  await ctx.db.insert("timelineEvents", {
    searchId,
    kind,
    title,
    body,
    createdAt: Date.now(),
  });
}

async function insertTodo(
  ctx: MutationCtx,
  args: {
    searchId: Id<"searches">;
    applicationId: Id<"applications">;
    schoolId?: Id<"schools">;
    title: string;
    actionType: string;
    dueLabel: string;
    sourceLinks: string[];
  },
) {
  const now = Date.now();
  return await ctx.db.insert("todos", {
    searchId: args.searchId,
    applicationId: args.applicationId,
    schoolId: args.schoolId,
    title: args.title,
    actionType: args.actionType,
    status: "not_started",
    dueLabel: args.dueLabel,
    sourceLinks: args.sourceLinks,
    createdAt: now,
    updatedAt: now,
  });
}

async function buildTodoResult(
  ctx: MutationCtx,
  actionType: string,
  context: {
    searchId: Id<"searches">;
    schoolId?: Id<"schools">;
    applicationTitle: string;
    schoolName: string;
  },
) {
  if (actionType === "build_ranked_list") {
    const rankings = await ctx.db
      .query("rankings")
      .withIndex("by_searchId", (q) => q.eq("searchId", context.searchId))
      .take(50);
    const lines = [];
    for (const ranking of rankings
      .filter((item) => item.shortlisted)
      .sort((a, b) => a.parentRank - b.parentRank)) {
      const school = await ctx.db.get(ranking.schoolId);
      if (school && school.schoolType !== "Private") {
        lines.push(`${lines.length + 1}. ${school.name}`);
      }
    }
    return {
      title: "Ranked-choice list",
      body:
        lines.length > 0
          ? `${lines.join("\n")}\n\nUse this order in the district portal if it still matches your true preference.`
          : "No public schools are shortlisted yet. Add public schools to the shortlist first.",
    };
  }

  if (actionType === "prepare_document_checklist") {
    return {
      title: "Document checklist",
      body:
        context.schoolId === undefined
          ? "Prepare proof of address, child birth record, parent/guardian ID, and any program-specific documents before opening the SFUSD portal."
          : `For ${context.schoolName}, prepare child information, parent contact details, prior school records if requested, tour/interview availability, and financial aid materials if applicable.`,
    };
  }

  if (actionType === "draft_email") {
    return {
      title: "Email draft",
      body: [
        "Hello,",
        "",
        `I am comparing ${context.applicationTitle} for my child and would like to confirm the next steps.`,
        "",
        "Could you confirm grade eligibility, key deadlines, required documents, tour or information-session options, and anything families often miss?",
        "",
        "Thank you.",
      ].join("\n"),
    };
  }

  if (actionType === "draft_parent_statement") {
    return {
      title: "Parent statement outline",
      body: [
        `Why ${context.schoolName} fits our child:`,
        "- Learning environment and support needs",
        "- Interests, strengths, and growth areas",
        "- Family priorities around commute, community, and after-school coverage",
        "- Questions to answer after tour or admissions reply",
      ].join("\n"),
    };
  }

  if (actionType === "handoff_to_portal") {
    return {
      title: "Portal handoff",
      body: "Open the official district enrollment portal, copy the ranked-choice list, attach the prepared documents, and submit only after a parent reviews the final order.",
    };
  }

  if (actionType === "summarize_reply") {
    const messages = await ctx.db
      .query("communications")
      .withIndex("by_searchId", (q) => q.eq("searchId", context.searchId))
      .order("desc")
      .take(10);
    const latestInbound = messages.find(
      (message) => message.direction === "inbound",
    );
    return {
      title: "Reply summary",
      body:
        latestInbound?.summary ??
        "No inbound admissions or enrollment reply has been received yet.",
    };
  }

  return {
    title: "Action completed",
    body: `SchoolPick completed ${actionType} for ${context.schoolName}.`,
  };
}
