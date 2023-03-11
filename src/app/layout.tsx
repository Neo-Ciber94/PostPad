import "./globals.css";
import Content from "@/components/Content";

export const metadata = {
  title: "Posts App",
  description: "An app to create posts",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className="bg-base-500 scrollbar
            scrollbar-track-base-300/25
            scrollbar-thumb-rounded-lg 
            scrollbar-thumb-base-700"
      >
        <Content>{children}</Content>
      </body>
    </html>
  );
}
