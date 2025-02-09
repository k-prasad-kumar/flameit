import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import "./globals.css";
import { getCurrentUser } from "@/lib/current-user-data";
import { Toaster } from "sonner";
import { SocketProvider } from "@/context/use.socket";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

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
      <Head>
        <title>FlameIt.</title>
        <meta name="description" content="A place to share your thoughts" />

        <meta property="og:url" content="https://flameit.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="FlameIt." />
        <meta
          property="og:description"
          content="A place to share your thoughts"
        />
        <meta
          property="og:image"
          content="https://opengraph.b-cdn.net/production/images/0badbfa3-7dfe-4bd6-bacf-3acfdbe0910e.png?token=tjbvA8rbzoIm-CDyBYda1OJGIOxreBtRd39GZToX-_w&height=630&width=1200&expires=33275109214"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="flameit.vercel.app" />
        <meta property="twitter:url" content="https://flameit.vercel.app" />
        <meta name="twitter:title" content="FlameIt." />
        <meta
          name="twitter:description"
          content="A place to share your thoughts"
        />
        <meta
          name="twitter:image"
          content="https://opengraph.b-cdn.net/production/images/0badbfa3-7dfe-4bd6-bacf-3acfdbe0910e.png?token=tjbvA8rbzoIm-CDyBYda1OJGIOxreBtRd39GZToX-_w&height=630&width=1200&expires=33275109214"
        />
      </Head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SocketProvider userId={user?.id as string}>
            <Header userId={user?.id as string} />
            {children}
            {user && <Sidebar />}
          </SocketProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
