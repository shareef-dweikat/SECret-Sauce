import { Elysia } from "elysia";
import { filingsQuery } from "../schemas/filings";
import { tickerParams } from "../schemas/ticker";
import { fetchCompanyFilings, listFilings, lookupCik } from "../services/sec";

export const companiesRoutes = new Elysia().get(
  "/companies/:ticker/filings",
  async ({ params: { ticker }, query }) => {
    const cik = await lookupCik(ticker);
    const { name, filings } = await fetchCompanyFilings(cik);
    const { filings: page, pagination } = listFilings(filings, {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      form: query.form,
    });
    return { ticker: ticker.toUpperCase(), cik, name, filings: page, pagination };
  },
  { params: tickerParams, query: filingsQuery },
);
