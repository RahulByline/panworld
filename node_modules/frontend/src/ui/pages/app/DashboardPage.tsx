import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../store/auth.store";
import { RoleDashboard } from "./dashboards/RoleDashboards";

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)!;
  const school = useAuthStore((s) => s.school);
  const { t } = useTranslation();

  return (
    <RoleDashboard
      role={user.role}
      contextLabel={school ? `${school.name} • ${school.country} • ${school.curriculumType}` : t("app.name")}
      country={school?.country ?? null}
    />
  );
}

