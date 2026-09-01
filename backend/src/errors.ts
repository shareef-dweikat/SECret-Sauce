export type ApiError = {
  error: string;
  code?: string;
};

export class NotFoundError extends Error {
  status = 404;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UpstreamError extends Error {
  status = 502;

  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = "UpstreamError";
  }
}
