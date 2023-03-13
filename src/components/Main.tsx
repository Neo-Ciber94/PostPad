"use client";
import Header from "@/components/Header";
import { PropsWithChildren } from "react";
import { QueryClientProvider } from "react-query";
import { QueryClient } from "react-query";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import Authorized from "./Authorized";

const queryClient = new QueryClient();

export interface MainProps {
  session: Session | null;
}

const Main: React.FC<PropsWithChildren<MainProps>> = ({
  children,
  session,
}) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <main className="mx-auto h-full md:container">
          <Authorized>{children}</Authorized>
        </main>
      </QueryClientProvider>
    </SessionProvider>
  );
};


export default Main;
