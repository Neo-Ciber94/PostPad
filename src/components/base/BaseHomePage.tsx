"use client";
import { useSession } from "next-auth/react";
import Delayed from "../Delayed";
import LoadingSpinner from "../loading/LoadingSpinner";
import Redirect from "../Redirect";
import SignIn from "../SignIn";

export default function BaseHomePage() {
  const { status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  return status === "authenticated" ? (
    <Redirect to="/posts" fallback={<Loading />} replace />
  ) : (
    <SignIn />
  );
}

function Loading() {
  return (
    <div className="p-36">
      <Delayed ms={1000}>
        <LoadingSpinner size={40} width={5} />
      </Delayed>
    </div>
  );
}
