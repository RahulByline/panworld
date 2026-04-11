/** Static content aligned with panworld_phase1_mvp.html — wired to i18n keys under `app.schoolDashboard`. */

export type ChecklistState = "done" | "active" | "todo";

export type SchoolChecklistRow = {
  id: string;
  state: ChecklistState;
  labelKey: string;
  catalogueCta?: boolean;
};

export const schoolGettingStartedChecklist: SchoolChecklistRow[] = [
  { id: "profile", state: "done", labelKey: "app.schoolDashboard.checklist.profile" },
  { id: "browse", state: "done", labelKey: "app.schoolDashboard.checklist.browse" },
  { id: "demo", state: "done", labelKey: "app.schoolDashboard.checklist.demo" },
  { id: "sample", state: "done", labelKey: "app.schoolDashboard.checklist.sample" },
  { id: "wishlist", state: "active", labelKey: "app.schoolDashboard.checklist.wishlist", catalogueCta: true },
  { id: "firstRfq", state: "todo", labelKey: "app.schoolDashboard.checklist.firstRfq" },
  { id: "inviteStaff", state: "todo", labelKey: "app.schoolDashboard.checklist.inviteStaff" },
  { id: "training", state: "todo", labelKey: "app.schoolDashboard.checklist.training" },
  { id: "webinar", state: "todo", labelKey: "app.schoolDashboard.checklist.webinar" },
];

export const schoolDashboardChecklistSummary = { done: 4, total: 9 };

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
  emoji: string;
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
    emoji: "📗",
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
    emoji: "📘",
    productTitleKey: "app.schoolDashboard.products.achieveEla.title",
    productSubKey: "app.schoolDashboard.products.achieveEla.sub",
    priceAed: 145,
    priceSar: 149,
    priceUnitKey: "perLicence",
    pubClass: "achieve",
  },
  {
    id: "studysyncG68",
    emoji: "📙",
    productTitleKey: "app.schoolDashboard.products.studysyncG68.title",
    productSubKey: "app.schoolDashboard.products.studysyncG68.sub",
    priceAed: 120,
    priceSar: 124,
    priceUnitKey: "perLicence",
    pubClass: "studysync",
  },
  {
    id: "kodeitSocSci",
    emoji: "🏫",
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
    emoji: "🔤",
    productTitleKey: "app.schoolDashboard.products.jollyKg.title",
    productSubKey: "app.schoolDashboard.products.jollyKg.sub",
    priceAed: 320,
    priceSar: 329,
    priceUnitKey: "perClassroom",
    badge: "newPartner",
    pubClass: "jolly",
  },
];

export const featuredNewTitles: SchoolProductHighlight[] = [
  {
    id: "revealMath",
    emoji: "📐",
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
    emoji: "🗣️",
    productTitleKey: "app.schoolDashboard.products.studysyncGcc.title",
    productSubKey: "app.schoolDashboard.products.studysyncGcc.sub",
    priceAed: 120,
    priceSar: 124,
    priceUnitKey: "perLicence",
    badge: "newArabic",
    pubClass: "studysync",
  },
];

export type PublisherQuick = {
  id: string;
  icon: string;
  labelKey: string;
  highlight?: boolean;
  ourBrand?: boolean;
};

export const publisherQuickAccess: PublisherQuick[] = [
  { id: "mcgraw", icon: "📗", labelKey: "app.schoolDashboard.publishers.mcgraw" },
  { id: "kodeit", icon: "🏫", labelKey: "app.schoolDashboard.publishers.kodeit", highlight: true, ourBrand: true },
  { id: "studysync", icon: "📘", labelKey: "app.schoolDashboard.publishers.studysync" },
  { id: "achieve", icon: "📙", labelKey: "app.schoolDashboard.publishers.achieve3000" },
  { id: "oxford", icon: "📕", labelKey: "app.schoolDashboard.publishers.oxford" },
];

export const schoolWishlistPreview = { itemCount: 5, staleCount: 2 };
