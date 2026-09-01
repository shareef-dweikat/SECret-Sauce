import { useEffect, useState } from "react";

type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
};

type HealthState =
  | { kind: "loading" }
  | { kind: "ok"; data: HealthResponse }
  | { kind: "error"; message: string };

export default function App() {
  const [health, setHealth] = useState<HealthState>({ kind: "loading" });

  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<HealthResponse>;
      })
      .then((data) => setHealth({ kind: "ok", data }))
      .catch((err: Error) =>
        setHealth({ kind: "error", message: err.message }),
      );
  }, []);

  return (
    <main className="app">
      <header>
        <h1>SECret-Sauce</h1>
        <p className="tagline">SEC filings research and analysis</p>
      </header>

      <section className="status-card">
        <h2>API Status</h2>
        {health.kind === "loading" && <p className="status loading">Checking…</p>}
        {health.kind === "ok" && (
          <div className="status ok">
            <p>Backend is healthy</p>
            <dl>
              <dt>Service</dt>
              <dd>{health.data.service}</dd>
              <dt>Timestamp</dt>
              <dd>{health.data.timestamp}</dd>
            </dl>
          </div>
        )}
        {health.kind === "error" && (
          <p className="status error">Unable to reach API: {health.message}</p>
        )}
      </section>
    </main>
  );
}
