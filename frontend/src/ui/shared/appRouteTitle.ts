/** Longest prefix wins. `/app` index must be checked explicitly (not prefix of everything). */
export function routeTitleKey(pathname: string): string {
  const normalized = pathname.replace(/\/$/, "") || "/app";

  const rules: { prefix: string; key: string }[] = [
    { prefix: "/app/catalogue", key: "nav.catalogueLong" },
    { prefix: "/app/library", key: "nav.libraryBooks" },
    { prefix: "/app/kits", key: "nav.kits" },
    { prefix: "/app/wishlist", key: "nav.wishlist" },
    { prefix: "/app/curriculum-mapping", key: "nav.curriculumMapping" },
    { prefix: "/app/demo-hub", key: "nav.demoHub" },
    { prefix: "/app/announcements", key: "nav.announcements" },
    { prefix: "/app/contacts", key: "nav.contactDirectory" },
    { prefix: "/app/training", key: "nav.productTraining" },
    { prefix: "/app/support", key: "nav.support" },
    { prefix: "/app/webinars", key: "nav.pdWebinars" },
    { prefix: "/app/resources", key: "nav.resources" },
    { prefix: "/app/samples", key: "nav.samples" },
    { prefix: "/app/certificates", key: "nav.myCertificates" },
    { prefix: "/app/assessment", key: "nav.assessment" },
    { prefix: "/app/analytics", key: "nav.analytics" },
    { prefix: "/app/rfq", key: "nav.rfqOrders" },
    { prefix: "/app/orders", key: "nav.orderHistory" },
    { prefix: "/app/invoices", key: "nav.invoices" },
    { prefix: "/app/users", key: "nav.userManagement" },
    { prefix: "/app/sync-logs", key: "nav.syncLogs" },
  ];

  for (const { prefix, key } of rules) {
    if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
      return key;
    }
  }

  if (normalized === "/app") {
    return "nav.dashboard";
  }

  return "nav.dashboard";
}
