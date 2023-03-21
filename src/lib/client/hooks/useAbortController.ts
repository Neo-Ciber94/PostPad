import { useCallback, useEffect, useMemo, useState } from "react";

export interface UseAbortControllerOptions {
  onAbort?: () => void;
}

export function useAbortController(options: UseAbortControllerOptions = {}) {
  const { onAbort } = options;
  const [controller, setController] = useState<AbortController | null>(null);

  const abort = useCallback(() => {
    if (controller) {
      controller.abort();
      setController(null);
    }
  }, [controller]);

  const signal = useMemo(() => {
    const newController = controller ?? new AbortController();

    if (controller == null) {
      setController(newController);
    }

    return newController.signal;
  }, [controller]);

  const isAborted = useMemo(() => signal.aborted, [signal.aborted]);

  useEffect(() => {
    if (onAbort == null) {
      return;
    }

    signal.addEventListener("abort", onAbort);
    return () => {
      signal.removeEventListener("abort", onAbort);
    };
  }, [onAbort, signal]);

  return { abort, signal, isAborted };
}
