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
    "Track Indeed and Seek jobs locally. Upgrade to Pro for Hide jobs and ATS results.",
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
