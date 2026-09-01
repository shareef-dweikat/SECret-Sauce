import path from "node:path";
import { staticPlugin } from "@elysiajs/static";
import { app } from "./app";
const nodeEnv = process.env["NODE_ENV"] ?? "development";
const isProd = nodeEnv === "production";
const port = Number(process.env["PORT"]) || 3000;

if (isProd) {
  const staticRoot = path.resolve(process.cwd(), "frontend/dist");

  app.use(
    staticPlugin({
      assets: staticRoot,
      prefix: "/",
    }),
  );

  app.get("/*", ({ path: pathname, set }) => {
    if (pathname.startsWith("/api")) {
      set.status = 404;
      return { error: "Not found" };
    }
    set.headers["content-type"] = "text/html";
    return Bun.file(path.join(staticRoot, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`SECret-Sauce running at http://localhost:${port}`);
});
