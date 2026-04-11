/** Sales portal routes under `/app`. */
export function salesRouteTitleKey(pathname: string): string {
  const normalized = pathname.replace(/\/$/, "") || "/app";

  const rules: { prefix: string; key: string }[] = [
    { prefix: "/app/sales/schools", key: "salesPortal.titles.schools" },
    { prefix: "/app/sales/pipeline", key: "salesPortal.titles.pipeline" },
    { prefix: "/app/sales/signals", key: "salesPortal.titles.signals" },
    { prefix: "/app/sales/performance", key: "salesPortal.titles.performance" },
  ];

  for (const { prefix, key } of rules) {
    if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
      return key;
    }
  }

  if (normalized === "/app") {
    return "salesPortal.titles.dashboard";
  }

  return "salesPortal.titles.dashboard";
}
