export type MockEmailEvent = {
  to: string;
  subject: string;
  template: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

const events: MockEmailEvent[] = [];

export const emailService = {
  send: async (event: Omit<MockEmailEvent, "createdAt">) => {
    events.unshift({ ...event, createdAt: new Date().toISOString() });
    return { ok: true };
  },
  list: async () => events.slice(0, 200),
};

