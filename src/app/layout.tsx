import Header from "@/components/Header";
import "./globals.css";

export const metadata = {
  title: "Notes App",
  description: "An app to create notes",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className="dark:bg-slate-700">
      <body>
        <Header />
        <main className="dark:bg-slate-700 h-full container mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
