import type { Elysia } from "elysia";
import { NotFoundError, UpstreamError } from "../errors";

const isDev = (process.env["NODE_ENV"] ?? "development") !== "production";

export const withErrorHandler = <const T extends Elysia>(app: T) =>
  app
    .error({
      NOT_FOUND_ERROR: NotFoundError,
      UPSTREAM_ERROR: UpstreamError,
    })
    .onError(({ code, error, set }) => {
      if (code === "VALIDATION") {
        set.status = 400;
        return {
          error: error.message,
          code: "VALIDATION",
        };
      }

      if (code === "NOT_FOUND") {
        set.status = 404;
        return { error: "Route not found" };
      }

      if (code === "NOT_FOUND_ERROR") {
        set.status = error.status;
        return { error: error.message, code: "NOT_FOUND" };
      }

      if (code === "UPSTREAM_ERROR") {
        set.status = error.status;
        console.error("Upstream failure:", error.cause ?? error);
        return { error: error.message, code: "UPSTREAM_ERROR" };
      }

      set.status = 500;
      if (isDev) {
        console.error("Unhandled error:", error);
      }
      return { error: "Internal server error" };
    });
