import "./styles/globals.scss";
import Main from "@/components/Main";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getUserPreferredColorScheme } from "@/lib/server/utils/getUserPreferredColorScheme";
import { DarkModeProvider } from "@/lib/client/contexts/DarkModeContext";

export const metadata = {
  title: "PostPad",
  description: "An app to create posts",
};

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const session = await getServerSession(authOptions);
  const preferredColorScheme = getUserPreferredColorScheme();

  return (
    <html lang="en">
      <body
        className="bg-base-500 scrollbar
            scrollbar-track-base-300/25
            scrollbar-thumb-base-700 
            scrollbar-thumb-rounded-lg"
      >
        <DarkModeProvider preferredColorScheme={preferredColorScheme}>
          <Main session={session}>{children}</Main>
        </DarkModeProvider>
      </body>
    </html>
  );
}
