import { useMemo } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { getPortalMock } from "../../../mock/portal";
import type { CountryCode } from "../../../types/domain";

export function usePortalMock() {
  const school = useAuthStore((s) => s.school);
  const country: CountryCode = (school?.country ?? "UAE") as CountryCode;
  return useMemo(() => getPortalMock(country), [country]);
}

