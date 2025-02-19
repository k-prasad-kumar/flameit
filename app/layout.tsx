import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import "./globals.css";
import { getCurrentUser } from "@/lib/current-user-data";
import { Toaster } from "sonner";
import { SocketProvider } from "@/context/use.socket";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlameIt.",
  description:
    "FlameIt: Share your world, connect with friends. Photos, posts, stories, and chat – all in one place.",

  openGraph: {
    title: "FlameIt.",
    description:
      "FlameIt: Share your world, connect with friends. Photos, posts, stories, and chat – all in one place.",
    url: "https://flameit.vercel.app",
    siteName: "FlameIt.vercel.app.",
    images: process.env.OG_IMAGE as string,
    locale: "en-US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "FlameIt.",
    description:
      "FlameIt: Share your world, connect with friends. Photos, posts, stories, and chat – all in one place.",
    images: process.env.OG_IMAGE as string,
  },
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["FlameIt.", "FlameIt", "FlameIt", "FlameIt", "FlameIt"],
  authors: [{ name: "FlameIt", url: "https://flameit.vercel.app" }],
  // viewport:
  //   " minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "/icons/logo-512.png" },
    { rel: "icon", url: "/icons/logo-512.png" },
  ],
};

export const viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  shrinkToFit: "no",
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/logo-512.png" />
        <link rel="icon" href="/icons/logo-512.png" />
      </head>
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
            {user && (
              <Sidebar
                userId={user?.id as string}
                username={user?.username as string}
                userImage={user?.image as string}
              />
            )}
          </SocketProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
