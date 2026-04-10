const events = [];
export const emailService = {
    send: async (event) => {
        events.unshift({ ...event, createdAt: new Date().toISOString() });
        return { ok: true };
    },
    list: async () => events.slice(0, 200),
};
