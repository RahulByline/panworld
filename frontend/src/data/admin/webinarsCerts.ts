export type WebinarRow = {
  id: string;
  title: string;
  host: string;
  startsAt: string;
  registrations: number;
  maxSeats: number;
  duration: string;
  status: "Upcoming" | "Completed";
};

export const webinarSummary = {
  upcomingCount: 2,
  registeredTotal: 70,
  pastRecorded: 2,
};

export const webinarsUpcoming: WebinarRow[] = [
  {
    id: "wb-1",
    title: "Inspire Science — Assessment best practices",
    host: "McGraw Hill",
    startsAt: "18 Apr 2026 · 10:00 GST",
    registrations: 42,
    maxSeats: 120,
    duration: "45 min",
    status: "Upcoming",
  },
  {
    id: "wb-2",
    title: "StudySync Arabic UI walkthrough",
    host: "StudySync",
    startsAt: "22 Apr 2026 · 14:00 GST",
    registrations: 28,
    maxSeats: 80,
    duration: "60 min",
    status: "Upcoming",
  },
];

export const webinarsPast: WebinarRow[] = [
  {
    id: "wb-p1",
    title: "Reveal Math 2025 — What’s new",
    host: "McGraw Hill",
    startsAt: "2 Apr 2026",
    registrations: 156,
    maxSeats: 200,
    duration: "50 min",
    status: "Completed",
  },
  {
    id: "wb-p2",
    title: "Kodeit Social Sciences — classroom setup",
    host: "Kodeit",
    startsAt: "25 Mar 2026",
    registrations: 89,
    maxSeats: 150,
    duration: "40 min",
    status: "Completed",
  },
];

export type CertRow = {
  id: string;
  recipient: string;
  school: string;
  course: string;
  issuedAt: string;
  hours: number;
};

export const certSummary = {
  issued30d: 47,
  schoolsCount: 12,
  verified: true,
};

export const certificationsIssued: CertRow[] = [
  {
    id: "CERT-2026-0312",
    recipient: "Sarah Al-Mansoori",
    school: "Al Noor International",
    course: "Inspire Science G4–G6",
    issuedAt: "11 Apr 2026",
    hours: 6,
  },
  {
    id: "CERT-2026-0301",
    recipient: "James Porter",
    school: "Taaleem Brighton",
    course: "STEM Lab Safety",
    issuedAt: "8 Apr 2026",
    hours: 3,
  },
  {
    id: "CERT-2026-0288",
    recipient: "Layla Al-Shehhi",
    school: "King Faisal International",
    course: "Jolly Phonics Foundations",
    issuedAt: "4 Apr 2026",
    hours: 5,
  },
  {
    id: "CERT-2026-0275",
    recipient: "Omar Hassan",
    school: "Dubai British School",
    course: "Digital assessment tools",
    issuedAt: "28 Mar 2026",
    hours: 4,
  },
];
