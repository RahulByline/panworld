export type PublisherPartnerRow = {
  id: string;
  name: string;
  territory: string;
  contact: string;
  activeSchools: number;
  status: "Active" | "Onboarding" | "Paused";
};

export const publisherPartners: PublisherPartnerRow[] = [
  {
    id: "pub-mh",
    name: "McGraw Hill",
    territory: "MEA · K–12",
    contact: "mea.partners@mcgrawhill.com",
    activeSchools: 58,
    status: "Active",
  },
  {
    id: "pub-kodeit",
    name: "Kodeit",
    territory: "GCC · K–12",
    contact: "schools@kodeit.com",
    activeSchools: 42,
    status: "Active",
  },
  {
    id: "pub-ss",
    name: "StudySync",
    territory: "GCC · G6–G12",
    contact: "gcc@studysync.com",
    activeSchools: 31,
    status: "Active",
  },
  {
    id: "pub-jp",
    name: "Jolly Phonics",
    territory: "UAE · Early years",
    contact: "export@jollylearning.co.uk",
    activeSchools: 12,
    status: "Onboarding",
  },
  {
    id: "pub-a3k",
    name: "Achieve3000",
    territory: "MEA · Literacy",
    contact: "partners@achieve3000.com",
    activeSchools: 24,
    status: "Paused",
  },
];
