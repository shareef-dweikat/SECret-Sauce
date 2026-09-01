import { Elysia } from "elysia";
import { tickerParams } from "../schemas/ticker";
import { fetchCompanyFilings, lookupCik } from "../services/sec";

export const companiesRoutes = new Elysia().get(
  "/companies/:ticker/filings",
  async ({ params: { ticker } }) => {
    const cik = await lookupCik(ticker);
    const { name, filings } = await fetchCompanyFilings(cik);
    return { ticker: ticker.toUpperCase(), cik, name, filings };
  },
  { params: tickerParams },
);
