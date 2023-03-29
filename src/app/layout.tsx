import "./styles/globals.scss";
import "highlight.js/styles/monokai.css";
import Main from "@/components/Main";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { DarkModeProvider } from "@/lib/client/contexts/DarkModeContext";
import { getUserPrefersDarkMode } from "@/lib/server/utils/getUserPrefersDarkMode";
import type { Metadata } from "next";
import { headers as getHeaders } from "next/headers";

const defaultMetadata = {
  title: "PostPad",
  description: "An AI powered application that allow users to create and share personal blog posts",
  images: getMetadataImages(),
};

export function generateMetadata(): Metadata {
  const title = defaultMetadata.title;
  const description = defaultMetadata.description;

  return {
    title,
    description,
    icons: {
      icon: "/favicon.ico",
    },

    // This is not working
    viewport: {
      width: "device-width",
      initialScale: 1.0,
    },

    openGraph: {
      title,
      description,
      images: defaultMetadata.images,
    },

    twitter: {
      title,
      description,
      images: defaultMetadata.images,
    },
  };
}

export default async function RootLayout({ children }: React.PropsWithChildren) {
  const session = await getServerSession(authOptions);
  const prefersDarkMode = getUserPrefersDarkMode();

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <DefaultMetadata />
      </head>
      <body className="bg-base-500">
        <DarkModeProvider prefersDarkMode={prefersDarkMode}>
          <Main session={session}>{children}</Main>
        </DarkModeProvider>
      </body>
    </html>
  );
}

type Size = {
  width: number;
  height: number;
};

function getMetadataImages() {
  const headers = getHeaders();
  const host = headers.get("host");

  if (!host) {
    throw new Error("host not required");
  }

  const schema = process.env.VERCEL === "1" ? "https" : "http";
  const baseUrl = `${schema}://${host}/api/og`;

  const imageSizes: Size[] = [
    { width: 1200, height: 630 },
    { width: 800, height: 418 },
    { width: 400, height: 209 },
  ];

  const result = imageSizes.map(({ width, height }) => ({
    width,
    height,
    url: `${baseUrl}?width=${width}&height=${height}`,
  }));

  return result;
}

// FIXME: This is a workaround the metadata not showing in the /
function DefaultMetadata() {
  const images = defaultMetadata.images;

  // FIXME: Read from environment variable
  const url = process.env.VERCEL === "1" ? "https://postpad.vercel.app" : "";

  return (
    <>
      <title>{defaultMetadata.title}</title>
      <meta name="title" content={defaultMetadata.title} />
      <meta name="description" content={defaultMetadata.description} />
      <meta name="icon" content="/favicon.ico" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={defaultMetadata.title} />
      <meta property="og:description" content={defaultMetadata.description} />

      {images.map((img, idx) => (
        <meta key={idx} property="og:image" content={img.url} />
      ))}

      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={defaultMetadata.title} />
      <meta property="twitter:description" content={defaultMetadata.description} />

      {images.map((img, idx) => (
        <meta key={idx} property="twitter:image" content={img.url} />
      ))}
    </>
  );
}
