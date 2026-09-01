import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { withErrorHandler } from "./plugins/error-handler";
import { healthRoutes } from "./routes/health";
import { companiesRoutes } from "./routes/companies";

const nodeEnv = process.env["NODE_ENV"] ?? "development";
const isDev = nodeEnv !== "production";

export const app = withErrorHandler(new Elysia())
  .use(
    cors({
      origin: isDev,
    }),
  )
  .group("/api", (app) => app.use(healthRoutes).use(companiesRoutes));

export type App = typeof app;
