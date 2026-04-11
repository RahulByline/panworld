import { useCallback, useEffect, useState } from "react";

export function useAdminToast(durationMs = 2800) {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback(
    (msg: string) => {
      setMessage(msg);
    },
    [],
  );

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(null), durationMs);
    return () => window.clearTimeout(t);
  }, [message, durationMs]);

  function Toast() {
    if (!message) return null;
    return (
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[250] max-w-md -translate-x-1/2 rounded-xl border border-[#E2E0D9] bg-[#1A1917] px-4 py-2.5 text-center text-sm text-white shadow-lg">
        {message}
      </div>
    );
  }

  return { show, Toast };
}
