import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { SessionProvider } from "@/components/SessionProvider";
import { APP_NAME } from "@/lib/copy";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "Don't waste hours wondering if a resume is even worth it. See job data on Indeed and Seek, then score the fit before you rewrite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
