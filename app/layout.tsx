import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import "./globals.css";
import { getCurrentUser } from "@/lib/current-user-data";
import { Toaster } from "sonner";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlameIt.",
  description: "A place to share your thoughts",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          {user && <Sidebar />}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
