import "./globals.css";
import Main from "@/components/Main";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const metadata = {
  title: "PostPad",
  description: "An app to create posts",
};

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="overflow-hidden">
      <body
        className="bg-base-500 scrollbar
            scrollbar-track-base-300/25
            scrollbar-thumb-base-700 
            scrollbar-thumb-rounded-lg"
      >
        <Main session={session}>{children}</Main>
      </body>
    </html>
  );
}
