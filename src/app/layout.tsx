/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import "./styles/globals.scss";
import Main from "@/components/Main";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { DarkModeProvider } from "@/lib/client/contexts/DarkModeContext";
import { getUserPrefersDarkMode } from "@/lib/server/utils/getUserPrefersDarkMode";
import Script from "next/script";

export const metadata = {
  title: "PostPad",
  description: "An app to create posts",
  icons: {
    icon: "/favicon.ico",
  },

  // This is not working
  viewport: {
    width: "device-width",
    initialScale: 1.0,
  },
};

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const session = await getServerSession(authOptions);
  const prefersDarkMode = getUserPrefersDarkMode();

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai-sublime.min.css"
        />
        <Script
          strategy="beforeInteractive"
          src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"
        />
      </head>
      <body
        className="bg-base-500 scrollbar
            scrollbar-track-base-300/25
            scrollbar-thumb-base-700 
            scrollbar-thumb-rounded-sm"
      >
        <DarkModeProvider prefersDarkMode={prefersDarkMode}>
          <Main session={session}>{children}</Main>
        </DarkModeProvider>
      </body>
    </html>
  );
}
