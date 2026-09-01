import { t } from "elysia";

export const tickerParam = t.String({
  pattern: "^[A-Za-z]{1,5}(-[A-Za-z]{1,3})?$",
  error:
    "Ticker must be 1-5 letters, optionally followed by - and a 1-3 letter suffix",
});

export const tickerParams = t.Object({ ticker: tickerParam });
