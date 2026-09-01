import type { Static, TSchema } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { t } from "elysia";
import { UpstreamError } from "../errors";

export const secCompanyTickerSchema = t.Object({
  cik_str: t.Number(),
  ticker: t.String(),
  title: t.String(),
});

export const secCompanyTickersResponseSchema = t.Record(
  t.String(),
  secCompanyTickerSchema,
);

export const secRecentFilingsSchema = t.Object({
  accessionNumber: t.Array(t.String()),
  form: t.Array(t.String()),
  filingDate: t.Array(t.String()),
  reportDate: t.Array(t.String()),
  primaryDocument: t.Array(t.String()),
  primaryDocDescription: t.Array(t.String()),
});

export const secSubmissionsResponseSchema = t.Object({
  cik: t.String(),
  name: t.String(),
  filings: t.Object({
    recent: secRecentFilingsSchema,
  }),
});

export type SecCompanyTickersResponse = Static<
  typeof secCompanyTickersResponseSchema
>;
export type SecRecentFilings = Static<typeof secRecentFilingsSchema>;
export type SecSubmissionsResponse = Static<
  typeof secSubmissionsResponseSchema
>;

export function parseSecResponse<T extends TSchema>(
  schema: T,
  data: unknown,
): Static<T> {
  if (!Value.Check(schema, data)) {
    throw new UpstreamError("Invalid response from SEC");
  }

  return data as Static<T>;
}
