import { NotFoundError, UpstreamError } from "../errors";

const SEC_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json";

type SecCompanyTicker = {
  cik_str: number;
  ticker: string;
  title: string;
};

type SecCompanyTickersResponse = Record<string, SecCompanyTicker>;

let tickerToCik: Map<string, number> | null = null;

async function loadTickerMap(): Promise<Map<string, number>> {
  if (tickerToCik) {
    return tickerToCik;
  }

  const userAgent =
    process.env["SEC_USER_AGENT"] ?? "SECret-Sauce app@example.com";

  let response: Response;

  try {
    response = await fetch(SEC_TICKERS_URL, {
      headers: {
        "User-Agent": userAgent,
        Accept: "application/json",
      },
    });
  } catch (cause) {
    throw new UpstreamError("Failed to fetch data from SEC", cause);
  }

  if (!response.ok) {
    throw new UpstreamError("Failed to fetch data from SEC", response.status);
  }

  const data = (await response.json()) as SecCompanyTickersResponse;

  tickerToCik = new Map(
    Object.values(data).map((entry) => [
      entry.ticker.toUpperCase(),
      entry.cik_str,
    ]),
  );

  return tickerToCik;
}

export async function lookupCik(ticker: string): Promise<number> {
  const map = await loadTickerMap();
  const cik = map.get(ticker.toUpperCase());

  if (cik === undefined) {
    throw new NotFoundError("Ticker not found");
  }

  return cik;
}
