type ErrorHandlerCallback = (error: Error, isFatal?: boolean) => void;

interface ErrorUtilsLike {
  setGlobalHandler: (callback: ErrorHandlerCallback) => void;
  getGlobalHandler?: () => ErrorHandlerCallback;
}

// `ErrorUtils` is a React Native global that owns the top-level JS exception
// handler. It isn't part of the public type surface, so we reach it via global.
const errorUtils = (globalThis as unknown as { ErrorUtils?: ErrorUtilsLike })
  .ErrorUtils;

let installed = false;

/**
 * @description Installs a process-wide handler for otherwise-uncaught JS
 * exceptions. It logs the error and then delegates to React Native's default
 * handler, preserving the dev red-box and the production fatal-crash behaviour.
 */
export function setupGlobalErrorHandler(): void {
  if (installed || !errorUtils) return;
  installed = true;

  const defaultHandler = errorUtils.getGlobalHandler?.();

  errorUtils.setGlobalHandler((error, isFatal) => {
    console.error(
      `[GlobalError]${isFatal ? " FATAL" : ""}:`,
      error?.stack ?? error,
    );

    defaultHandler?.(error, isFatal);
  });
}
