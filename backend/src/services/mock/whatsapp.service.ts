export type MockWhatsAppEvent = {
  to: string;
  message: string;
  channel: "whatsapp";
  createdAt: string;
};

const events: MockWhatsAppEvent[] = [];

export const whatsappService = {
  send: async (to: string, message: string) => {
    events.unshift({ to, message, channel: "whatsapp", createdAt: new Date().toISOString() });
    return { ok: true };
  },
  list: async () => events.slice(0, 200),
};

