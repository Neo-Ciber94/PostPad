"use client";
import Header from "@/components/Header";
import { PropsWithChildren } from "react";
import { QueryClientProvider } from "react-query";
import { QueryClient } from "react-query";

const queryClient = new QueryClient();

export default function Content({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main className="md:container mx-auto h-full">{children}</main>
    </QueryClientProvider>
  );
}
