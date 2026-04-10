const events = [];
export const whatsappService = {
    send: async (to, message) => {
        events.unshift({ to, message, channel: "whatsapp", createdAt: new Date().toISOString() });
        return { ok: true };
    },
    list: async () => events.slice(0, 200),
};
