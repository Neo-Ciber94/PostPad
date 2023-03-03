import "./globals.css";
import Content from "@/components/Content";

export const metadata = {
  title: "Notes App",
  description: "An app to create notes",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className="dark:bg-slate-700">
      <body>
        <Content>{children}</Content>
      </body>
    </html>
  );
}
