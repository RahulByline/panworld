import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../store/auth.store";
import { RoleDashboard, SchoolPartnerDashboard } from "../school-dashboard";

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)!;
  const school = useAuthStore((s) => s.school);
  const { t } = useTranslation();

  const isSchoolPartner =
    school != null && user.role !== "PUBLISHER" && user.role !== "PANWORLD_ADMIN";

  if (isSchoolPartner) {
    return <SchoolPartnerDashboard user={user} school={school} />;
  }

  return (
    <RoleDashboard
      role={user.role}
      contextLabel={school ? `${school.name} ${school.country} ${school.curriculumType}` : t("app.name")}
      country={school?.country ?? null}
    />
  );
}
