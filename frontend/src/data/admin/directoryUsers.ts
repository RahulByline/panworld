export type DirectoryUserRole =
  | "Teacher"
  | "HOD"
  | "School Admin"
  | "School CEO"
  | "Procurement"
  | "Sales (AM)"
  | "Panworld Admin"
  | "Publisher Login";

export type DirectoryUser = {
  id: string;
  name: string;
  email: string;
  role: DirectoryUserRole;
  school?: string;
  lastActive: string;
};

export const directoryUsers: DirectoryUser[] = [
  { id: "u1", name: "Sarah Al-Mansoori", email: "s.mansoori@alnoor.ae", role: "HOD", school: "Al Noor International", lastActive: "Today" },
  { id: "u1b", name: "Nora Al-Suwaidi", email: "n.suwaidi@alnoor.ae", role: "School Admin", school: "Al Noor International", lastActive: "Today" },
  { id: "u2", name: "Ahmed Al-Kaabi", email: "ceo@gemswellington.ae", role: "School CEO", school: "GEMS Wellington", lastActive: "Today" },
  { id: "u3", name: "Layla Al-Shehhi", email: "procurement@kfis.edu.sa", role: "Procurement", school: "King Faisal International", lastActive: "Yesterday" },
  { id: "u4", name: "James Porter", email: "j.porter@taaleem.ae", role: "Teacher", school: "Taaleem Brighton", lastActive: "2d ago" },
  { id: "u5", name: "Zara Al-Ahmad", email: "zara@panworld.ae", role: "Panworld Admin", lastActive: "Today" },
  { id: "u6", name: "McGraw Demo", email: "demo.mcgraw@publisher.test", role: "Publisher Login", school: "—", lastActive: "1w ago" },
  { id: "u7", name: "Mohamed Hassan", email: "m.hassan@panworld.ae", role: "Sales (AM)", school: "UAE · North portfolio", lastActive: "Today" },
];

export const directoryUserTabCounts: Record<string, number> = {
  all: 904,
  Teacher: 541,
  HOD: 138,
  "School Admin": 52,
  "School CEO": 47,
  Procurement: 89,
  "Sales (AM)": 18,
  "Panworld Admin": 12,
  "Publisher Login": 9,
};
