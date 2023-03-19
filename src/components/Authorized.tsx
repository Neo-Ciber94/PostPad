import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import Delayed from "./Delayed";
import LoadingSpinner from "./loading/LoadingSpinner";

const Authorized: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: session, status } = useSession({
    required: true,
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session && pathname === "/") {
      router.replace("/posts");
    }

    if (!session && pathname !== "/") {
      router.push("/");
    }
  }, [pathname, router, session]);

  if (status === "loading") {
    return <Loading />;
  }

  return <>{children}</>;
};

function Loading() {
  return (
    <div className="p-36">
      <Delayed ms={1000}>
        <LoadingSpinner size={40} width={5} />
      </Delayed>
    </div>
  );
}

export default Authorized;
