/** Static content aligned with panworld_phase1_mvp.html — wired to i18n keys under `app.schoolDashboard`. */

export type SchoolChecklistSubItem = {
  id: string;
  labelKey: string;
  trailKey: string;
  done: boolean;
  catalogueCta?: boolean;
};

export type SchoolChecklistAccordionSection = {
  id: string;
  titleKey: string;
  subItems: SchoolChecklistSubItem[];
};

export const schoolChecklistAccordionSections: SchoolChecklistAccordionSection[] = [
  {
    id: "schoolProfile",
    titleKey: "app.schoolDashboard.checklistAccordion.sectionSchoolProfile",
    subItems: [
      {
        id: "profile",
        labelKey: "app.schoolDashboard.checklistAccordion.subProfile",
        trailKey: "app.schoolDashboard.checklistAccordion.trailProfile",
        done: true,
      },
    ],
  },
  {
    id: "discovery",
    titleKey: "app.schoolDashboard.checklistAccordion.sectionDiscovery",
    subItems: [
      {
        id: "browse",
        labelKey: "app.schoolDashboard.checklistAccordion.subBrowse",
        trailKey: "app.schoolDashboard.checklistAccordion.trailBrowse",
        done: true,
      },
      {
        id: "demo",
        labelKey: "app.schoolDashboard.checklistAccordion.subDemo",
        trailKey: "app.schoolDashboard.checklistAccordion.trailDemo",
        done: true,
      },
      {
        id: "sample",
        labelKey: "app.schoolDashboard.checklistAccordion.subSample",
        trailKey: "app.schoolDashboard.checklistAccordion.trailSample",
        done: true,
      },
    ],
  },
  {
    id: "procurement",
    titleKey: "app.schoolDashboard.checklistAccordion.sectionProcurement",
    subItems: [
      {
        id: "wishlist",
        labelKey: "app.schoolDashboard.checklistAccordion.subWishlist",
        trailKey: "app.schoolDashboard.checklistAccordion.trailWishlist",
        done: false,
        catalogueCta: true,
      },
      {
        id: "firstRfq",
        labelKey: "app.schoolDashboard.checklistAccordion.subRfq",
        trailKey: "app.schoolDashboard.checklistAccordion.trailRfq",
        done: false,
      },
    ],
  },
  {
    id: "enablement",
    titleKey: "app.schoolDashboard.checklistAccordion.sectionEnablement",
    subItems: [
      {
        id: "inviteStaff",
        labelKey: "app.schoolDashboard.checklistAccordion.subStaff",
        trailKey: "app.schoolDashboard.checklistAccordion.trailStaff",
        done: false,
      },
      {
        id: "training",
        labelKey: "app.schoolDashboard.checklistAccordion.subTraining",
        trailKey: "app.schoolDashboard.checklistAccordion.trailTraining",
        done: false,
      },
      {
        id: "webinar",
        labelKey: "app.schoolDashboard.checklistAccordion.subWebinar",
        trailKey: "app.schoolDashboard.checklistAccordion.trailWebinar",
        done: false,
      },
    ],
  },
];

function accordionChecklistTotals(sections: SchoolChecklistAccordionSection[]) {
  let done = 0;
  let total = 0;
  for (const s of sections) {
    for (const item of s.subItems) {
      total += 1;
      if (item.done) done += 1;
    }
  }
  return { done, total };
}

export const schoolDashboardChecklistSummary = accordionChecklistTotals(schoolChecklistAccordionSections);

export const schoolAccountManager = {
  name: "Rania Khalil",
  roleLine: "Senior Account Manager · UAE",
  initials: "RK",
  email: "r.khalil@panworld.ae",
  /** UAE business WhatsApp (demo) — replace with live routing when integrated */
  whatsappE164: "971501112233",
};

export type AnnouncementTone = "brand" | "default" | "success";

export type SchoolAnnouncement = {
  id: string;
  tone: AnnouncementTone;
  titleKey: string;
  metaKey: string;
};

export const schoolDashboardAnnouncements: SchoolAnnouncement[] = [
  {
    id: "jolly",
    tone: "brand",
    titleKey: "app.schoolDashboard.announcements.jollyTitle",
    metaKey: "app.schoolDashboard.announcements.jollyMeta",
  },
  {
    id: "reveal",
    tone: "default",
    titleKey: "app.schoolDashboard.announcements.revealTitle",
    metaKey: "app.schoolDashboard.announcements.revealMeta",
  },
  {
    id: "achieve",
    tone: "success",
    titleKey: "app.schoolDashboard.announcements.achieveTitle",
    metaKey: "app.schoolDashboard.announcements.achieveMeta",
  },
];

export type ProductBadge = "newEd" | "ourBrand" | "newPartner" | "newArabic" | "ed2025";

export type SchoolProductHighlight = {
  id: string;
  productTitleKey: string;
  productSubKey: string;
  priceAed: number;
  priceSar: number;
  priceUnitKey: "perStudent" | "perLicence" | "perClassroom";
  badge?: ProductBadge;
  pubClass: "mcgraw" | "achieve" | "studysync" | "kodeit" | "jolly";
};

export const recommendedForYou: SchoolProductHighlight[] = [
  {
    id: "inspireScience",
    productTitleKey: "app.schoolDashboard.products.inspireScience.title",
    productSubKey: "app.schoolDashboard.products.inspireScience.sub",
    priceAed: 89,
    priceSar: 92,
    priceUnitKey: "perStudent",
    badge: "newEd",
    pubClass: "mcgraw",
  },
  {
    id: "achieveEla",
    productTitleKey: "app.schoolDashboard.products.achieveEla.title",
    productSubKey: "app.schoolDashboard.products.achieveEla.sub",
    priceAed: 145,
    priceSar: 149,
    priceUnitKey: "perLicence",
    pubClass: "achieve",
  },
  {
    id: "studysyncG68",
    productTitleKey: "app.schoolDashboard.products.studysyncG68.title",
    productSubKey: "app.schoolDashboard.products.studysyncG68.sub",
    priceAed: 120,
    priceSar: 124,
    priceUnitKey: "perLicence",
    pubClass: "studysync",
  },
  {
    id: "kodeitSocSci",
    productTitleKey: "app.schoolDashboard.products.kodeitSocSci.title",
    productSubKey: "app.schoolDashboard.products.kodeitSocSci.sub",
    priceAed: 75,
    priceSar: 78,
    priceUnitKey: "perStudent",
    badge: "ourBrand",
    pubClass: "kodeit",
  },
  {
    id: "jollyKg",
    productTitleKey: "app.schoolDashboard.products.jollyKg.title",
    productSubKey: "app.schoolDashboard.products.jollyKg.sub",
    priceAed: 320,
    priceSar: 329,
    priceUnitKey: "perClassroom",
    badge: "newPartner",
    pubClass: "jolly",
  },
];

/** Recent catalogue strip beside “Featured new titles” (three cards). */
export const schoolRecentCatalogue: SchoolProductHighlight[] = recommendedForYou.slice(0, 3);

export const featuredNewTitles: SchoolProductHighlight[] = [
  {
    id: "revealMath",
    productTitleKey: "app.schoolDashboard.products.revealMath.title",
    productSubKey: "app.schoolDashboard.products.revealMath.sub",
    priceAed: 95,
    priceSar: 98,
    priceUnitKey: "perStudent",
    badge: "ed2025",
    pubClass: "mcgraw",
  },
  {
    id: "studysyncGcc",
    productTitleKey: "app.schoolDashboard.products.studysyncGcc.title",
    productSubKey: "app.schoolDashboard.products.studysyncGcc.sub",
    priceAed: 120,
    priceSar: 124,
    priceUnitKey: "perLicence",
    badge: "newArabic",
    pubClass: "studysync",
  },
  {
    id: "jollyKg",
    productTitleKey: "app.schoolDashboard.products.jollyKg.title",
    productSubKey: "app.schoolDashboard.products.jollyKg.sub",
    priceAed: 320,
    priceSar: 329,
    priceUnitKey: "perClassroom",
    badge: "newPartner",
    pubClass: "jolly",
  },
];

/** Tabs for the Featured New Titles list panel (dashboard). */
export type FeaturedTitlesTabId = "all" | "stem" | "literacy" | "earlyYears";

export const featuredTitlesListTabs: readonly {
  id: FeaturedTitlesTabId;
  titleKey: string;
  productIds: readonly string[];
}[] = [
  {
    id: "all",
    titleKey: "app.schoolDashboard.featuredTabs.all",
    productIds: ["revealMath", "studysyncGcc", "jollyKg"],
  },
  {
    id: "stem",
    titleKey: "app.schoolDashboard.featuredTabs.stem",
    productIds: ["revealMath"],
  },
  {
    id: "literacy",
    titleKey: "app.schoolDashboard.featuredTabs.literacy",
    productIds: ["studysyncGcc"],
  },
  {
    id: "earlyYears",
    titleKey: "app.schoolDashboard.featuredTabs.earlyYears",
    productIds: ["jollyKg"],
  },
];

export type PublisherQuick = {
  id: string;
  labelKey: string;
  highlight?: boolean;
  ourBrand?: boolean;
};

export const publisherQuickAccess: PublisherQuick[] = [
  { id: "mcgraw", labelKey: "app.schoolDashboard.publishers.mcgraw" },
  { id: "kodeit", labelKey: "app.schoolDashboard.publishers.kodeit", highlight: true, ourBrand: true },
  { id: "studysync", labelKey: "app.schoolDashboard.publishers.studysync" },
  { id: "achieve", labelKey: "app.schoolDashboard.publishers.achieve3000" },
  { id: "oxford", labelKey: "app.schoolDashboard.publishers.oxford" },
];

export const schoolWishlistPreview = { itemCount: 5, staleCount: 2 };

/** Mock KPIs for the school home “quick overview” (replace with API when available). */
export const schoolOverviewStats = {
  openRfqs: 3,
  quotesAwaiting: 2,
  activeOrders: 4,
  samplesInProgress: 2,
  trainingCompletionPct: 68,
  openSupportTickets: 1,
};

export type PipelineStage = {
  id: string;
  labelKey: string;
  count: number;
  tone: "brand" | "accent" | "success" | "muted";
};

export const schoolRfqPipeline: PipelineStage[] = [
  { id: "draft", labelKey: "app.schoolDashboard.pipeline.draft", count: 1, tone: "muted" },
  { id: "submitted", labelKey: "app.schoolDashboard.pipeline.submitted", count: 2, tone: "brand" },
  { id: "quoted", labelKey: "app.schoolDashboard.pipeline.quoted", count: 2, tone: "accent" },
  { id: "ordered", labelKey: "app.schoolDashboard.pipeline.ordered", count: 4, tone: "success" },
];

export type SchoolActivityRow = {
  id: string;
  titleKey: string;
  metaKey: string;
  to: string;
};

export const schoolRecentActivity: SchoolActivityRow[] = [
  {
    id: "quote",
    titleKey: "app.schoolDashboard.activity.quoteApprovedTitle",
    metaKey: "app.schoolDashboard.activity.quoteApprovedMeta",
    to: "/app/rfq",
  },
  {
    id: "sample",
    titleKey: "app.schoolDashboard.activity.sampleShippedTitle",
    metaKey: "app.schoolDashboard.activity.sampleShippedMeta",
    to: "/app/samples",
  },
  {
    id: "training",
    titleKey: "app.schoolDashboard.activity.trainingTitle",
    metaKey: "app.schoolDashboard.activity.trainingMeta",
    to: "/app/training",
  },
];
