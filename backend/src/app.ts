import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { healthRoutes } from "./routes/health";

const nodeEnv = process.env["NODE_ENV"] ?? "development";
const isDev = nodeEnv !== "production";

export const app = new Elysia()
  .use(
    cors({
      origin: isDev,
    }),
  )
  .group("/api", (app) => app.use(healthRoutes));

export type App = typeof app;
