export type AnalyticsPublisherBar = { name: string; accesses: number; widthPct: number; tone: "success" | "brand" | "accent" };

export const analyticsSummary = {
  monthlyActiveSchools: 91,
  monthlyActiveSub: "64% of total · +5%",
  demoAccesses: 348,
  demoAccessesSub: "+40% vs last month",
  wishlistAdds: 1240,
  wishlistSub: "Across all schools",
  certificatesIssued: 218,
  certificatesSub: "This academic year",
};

export const publisherDemoAccesses: AnalyticsPublisherBar[] = [
  { name: "McGraw Hill ConnectED", accesses: 128, widthPct: 100, tone: "success" },
  { name: "StudySync", accesses: 84, widthPct: 66, tone: "brand" },
  { name: "Achieve3000", accesses: 62, widthPct: 48, tone: "accent" },
  { name: "Kodeit", accesses: 45, widthPct: 35, tone: "accent" },
  { name: "PowerSchool", accesses: 29, widthPct: 23, tone: "brand" },
];

export const conversionFunnel = [
  { label: "Catalogue Views", value: "4,820", bg: "bg-[#D6EAF8]", textColor: "text-[#0A3D62]" },
  { label: "Wishlist Adds", value: "1,240", sub: "(26%)", bg: "bg-[#D5F5E3]", textColor: "text-[#1E8449]" },
  { label: "Access requests", value: "348", sub: "(7%)", bg: "bg-[#FDEBD0]", textColor: "text-[#7D4E10]" },
  { label: "RFQ submissions", value: "97", sub: "(28% of requests)", bg: "bg-[#EDE7F6]", textColor: "text-[#512DA8]" },
  { label: "Orders confirmed", value: "68", sub: "(70%)", bg: "bg-[#D5F5E3]", textColor: "text-[#1E8449]" },
];
