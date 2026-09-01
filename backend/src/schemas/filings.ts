import { t } from "elysia";

export const filingsQuery = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
  form: t.Optional(t.String({ minLength: 1 })),
});
