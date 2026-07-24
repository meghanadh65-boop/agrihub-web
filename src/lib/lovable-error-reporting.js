// Generic error reporting utility (replaces Lovable-specific error reporting)
export function reportLovableError(error, context = {}) {
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);

  console.error("[Error Boundary]", message, context);
}
