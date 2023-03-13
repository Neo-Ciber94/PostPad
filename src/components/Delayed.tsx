import React, { PropsWithChildren, useEffect, useState } from "react";

export interface DelayedProps {
  ms?: number;
}

/**
 * Delay the rendering of a component.
 */
const Delayed: React.FC<PropsWithChildren<DelayedProps>> = ({
  ms,
  children,
}) => {
  const [isReady, setIsReady] = useState(ms == null);

  useEffect(() => {
    if (ms == null) {
      return;
    }

    const timeoutId = window.setTimeout(() => setIsReady(true), ms);
    return () => {
      clearInterval(timeoutId);
    };
  }, [ms]);

  return isReady ? <>{children}</> : <></>;
};

export default Delayed;
