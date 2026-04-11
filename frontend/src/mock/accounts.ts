import type { School, User } from "../types/domain";

export const DEMO_PASSWORD = "Panworld@123";

export type DemoAccount = {
  label: string;
  email: string;
  password: string;
  user: User;
  school: School | null;
  publisher: { id: string; name: string } | null;
};

const uaeSchool: School = {
  id: "sch_adbs",
  name: "Abu Dhabi British School",
  country: "UAE",
  curriculumType: "British",
  purchaseStatus: "ACTIVE_REPEAT",
  preferredLang: "en",
  enabledModules: { assessment: false, kodeitAcademy: true },
  vatRate: 5,
};

const ksaSchool: School = {
  id: "sch_jncc",
  name: "Jeddah NCC Academy",
  country: "KSA",
  curriculumType: "Saudi NCC",
  purchaseStatus: "ACTIVE_REPEAT",
  preferredLang: "ar",
  enabledModules: { assessment: true, kodeitAcademy: true, ncc: true },
  vatRate: 15,
};

export const demoAccounts: DemoAccount[] = [
  {
    label: "Panworld Admin",
    email: "admin@panworld-demo.com",
    password: DEMO_PASSWORD,
    user: {
      id: "usr_admin",
      email: "admin@panworld-demo.com",
      firstName: "Panworld",
      lastName: "Admin",
      role: "PANWORLD_ADMIN",
      schoolId: null,
      publisherId: null,
      preferredLang: "en",
      impersonatedById: null,
    },
    school: null,
    publisher: null,
  },
  {
    label: "School Management (UAE)",
    email: "management@panworld-demo.com",
    password: DEMO_PASSWORD,
    user: {
      id: "usr_mgmt",
      email: "management@panworld-demo.com",
      firstName: "Sara",
      lastName: "Management",
      role: "MANAGEMENT",
      schoolId: uaeSchool.id,
      publisherId: null,
      preferredLang: "en",
      impersonatedById: null,
    },
    school: uaeSchool,
    publisher: null,
  },
  {
    label: "Account Manager (Sales)",
    email: "sales@panworld-demo.com",
    password: DEMO_PASSWORD,
    user: {
      id: "usr_sales",
      email: "sales@panworld-demo.com",
      firstName: "Layla",
      lastName: "Account",
      role: "SALES_ADMIN",
      schoolId: null,
      publisherId: null,
      preferredLang: "en",
      impersonatedById: null,
    },
    school: null,
    publisher: null,
  },
  {
    label: "Teacher (UAE)",
    email: "teacher@panworld-demo.com",
    password: DEMO_PASSWORD,
    user: {
      id: "usr_teacher",
      email: "teacher@panworld-demo.com",
      firstName: "Aisha",
      lastName: "Teacher",
      role: "TEACHER",
      schoolId: uaeSchool.id,
      publisherId: null,
      preferredLang: "en",
      impersonatedById: null,
    },
    school: uaeSchool,
    publisher: null,
  },
  {
    label: "HOD (UAE)",
    email: "hod@panworld-demo.com",
    password: DEMO_PASSWORD,
    user: {
      id: "usr_hod",
      email: "hod@panworld-demo.com",
      firstName: "Omar",
      lastName: "HOD",
      role: "HOD",
      schoolId: uaeSchool.id,
      publisherId: null,
      preferredLang: "en",
      impersonatedById: null,
    },
    school: uaeSchool,
    publisher: null,
  },
  {
    label: "CEO (UAE)",
    email: "ceo@panworld-demo.com",
    password: DEMO_PASSWORD,
    user: {
      id: "usr_ceo",
      email: "ceo@panworld-demo.com",
      firstName: "Khalid",
      lastName: "CEO",
      role: "CEO",
      schoolId: uaeSchool.id,
      publisherId: null,
      preferredLang: "en",
      impersonatedById: null,
    },
    school: uaeSchool,
    publisher: null,
  },
  {
    label: "Procurement/Admin (UAE)",
    email: "procurement@panworld-demo.com",
    password: DEMO_PASSWORD,
    user: {
      id: "usr_proc",
      email: "procurement@panworld-demo.com",
      firstName: "Lina",
      lastName: "Procurement",
      role: "PROCUREMENT",
      schoolId: uaeSchool.id,
      publisherId: null,
      preferredLang: "en",
      impersonatedById: null,
    },
    school: uaeSchool,
    publisher: null,
  },
  {
    label: "Publisher (Oxford)",
    email: "publisher@panworld-demo.com",
    password: DEMO_PASSWORD,
    user: {
      id: "usr_pub",
      email: "publisher@panworld-demo.com",
      firstName: "Publisher",
      lastName: "Partner",
      role: "PUBLISHER",
      schoolId: null,
      publisherId: "pub_oxford",
      preferredLang: "en",
      impersonatedById: null,
    },
    school: null,
    publisher: { id: "pub_oxford", name: "Oxford" },
  },
  {
    label: "Teacher (KSA / Arabic default)",
    email: "teacher-ksa@panworld-demo.com",
    password: DEMO_PASSWORD,
    user: {
      id: "usr_teacher_ksa",
      email: "teacher-ksa@panworld-demo.com",
      firstName: "Noor",
      lastName: "Al Zahrani",
      role: "TEACHER",
      schoolId: ksaSchool.id,
      publisherId: null,
      preferredLang: "ar",
      impersonatedById: null,
    },
    school: ksaSchool,
    publisher: null,
  },
];

