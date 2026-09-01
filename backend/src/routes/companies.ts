import { Elysia } from "elysia";
import { tickerParams } from "../schemas/ticker";
import { lookupCik } from "../services/sec";

export const companiesRoutes = new Elysia().get(
  "/companies/:ticker/filings",
  async ({ params: { ticker } }) => {
    const cik = await lookupCik(ticker);
    return { ticker: ticker.toUpperCase(), cik };
  },
  { params: tickerParams },
);
