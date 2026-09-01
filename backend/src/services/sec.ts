import { NotFoundError, UpstreamError } from "../errors";

const SEC_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json";
const SEC_SUBMISSIONS_URL = "https://data.sec.gov/submissions";

type SecCompanyTicker = {
  cik_str: number;
  ticker: string;
  title: string;
};

type SecCompanyTickersResponse = Record<string, SecCompanyTicker>;

type SecRecentFilings = {
  accessionNumber: string[];
  form: string[];
  filingDate: string[];
  reportDate: string[];
  primaryDocument: string[];
  primaryDocDescription: string[];
};

type SecSubmissionsResponse = {
  cik: string;
  name: string;
  filings: {
    recent: SecRecentFilings;
  };
};

export type Filing = {
  accessionNumber: string;
  form: string;
  filingDate: string;
  reportDate: string;
  primaryDocument: string;
  primaryDocDescription: string;
};

let tickerToCik: Map<string, number> | null = null;

async function secFetch(url: string): Promise<Response> {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        "User-Agent": process.env["SEC_USER_AGENT"] ?? "SECret-Sauce app@example.com",
        Accept: "application/json",
      },
    });
  } catch (cause) {
    throw new UpstreamError("Failed to fetch data from SEC", cause);
  }

  if (!response.ok) {
    throw new UpstreamError("Failed to fetch data from SEC", response.status);
  }

  return response;
}

function formatCik(cik: number): string {
  return String(cik).padStart(10, "0");
}

function parseRecentFilings(recent: SecRecentFilings): Filing[] {
  return recent.accessionNumber.map((_, i) => ({
    accessionNumber: recent.accessionNumber[i]!,
    form: recent.form[i]!,
    filingDate: recent.filingDate[i]!,
    reportDate: recent.reportDate[i]!,
    primaryDocument: recent.primaryDocument[i]!,
    primaryDocDescription: recent.primaryDocDescription[i]!,
  }));
}

async function loadTickerMap(): Promise<Map<string, number>> {
  if (tickerToCik) {
    return tickerToCik;
  }

  const response = await secFetch(SEC_TICKERS_URL);
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

export async function fetchCompanyFilings(cik: number): Promise<{
  name: string;
  cik: number;
  filings: Filing[];
}> {
  const url = `${SEC_SUBMISSIONS_URL}/CIK${formatCik(cik)}.json`;
  const response = await secFetch(url);
  const data = (await response.json()) as SecSubmissionsResponse;

  return {
    name: data.name,
    cik: Number(data.cik),
    filings: parseRecentFilings(data.filings.recent),
  };
}
