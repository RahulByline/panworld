export type SchoolAssignmentRow = {
  school: string;
  country: string;
  accountManager: string;
  openRfqs: number;
  lastTouch: string;
};

export const schoolAssignments: SchoolAssignmentRow[] = [
  { school: "Al Noor International", country: "UAE", accountManager: "Mohamed Hassan", openRfqs: 2, lastTouch: "Today" },
  { school: "GEMS Wellington", country: "UAE", accountManager: "Rania Khalil", openRfqs: 1, lastTouch: "Yesterday" },
  { school: "King Faisal International", country: "KSA", accountManager: "Omar Hassan", openRfqs: 3, lastTouch: "Today" },
  { school: "Taaleem Brighton", country: "UAE", accountManager: "Mohamed Hassan", openRfqs: 0, lastTouch: "3d ago" },
  { school: "Dubai British School", country: "UAE", accountManager: "Rania Khalil", openRfqs: 1, lastTouch: "1w ago" },
];
