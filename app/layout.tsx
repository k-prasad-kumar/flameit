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
  description: "A place to share your thoughts",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "FlameIt.",
    description:
      "FlameIt: Express yourself, connect with your community, and discover amazing content. Share photos, create stories, and chat with friends.",
    url: "https://flameit.vercel.app",
    siteName: "FlameIt.vercel.app.",
    images:
      "https://res.cloudinary.com/flameit/image/upload/v1739565980/FlameIt_ozvqyt.png",
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlameIt.",
    description:
      "FlameIt: Express yourself, connect with your community, and discover amazing content. Share photos, create stories, and chat with friends.",
    images:
      "https://res.cloudinary.com/flameit/image/upload/v1739565980/FlameIt_ozvqyt.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html lang="en" suppressHydrationWarning>
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
