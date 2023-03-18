import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const EMPTY = <></>;

export interface RedirectProps {
  to: string;
  replace?: true;
  fallback?: React.ReactNode;
}

export default function Redirect({
  to,
  replace,
  fallback = EMPTY,
}: RedirectProps) {
  const router = useRouter();
  useEffect(() => {
    replace === true ? router.replace(to) : router.push(to);
  }, [replace, router, to]);

  return <>{fallback}</>;
}
