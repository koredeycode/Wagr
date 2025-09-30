import type { Metadata } from "next";
import { Noto_Sans, Spline_Sans } from "next/font/google";
import "./app.css";
import "./globals.css";
import Providers from "./providers";

import { Toaster } from "react-hot-toast";

const splineSans = Spline_Sans({
  variable: "--font-spline-sans",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wise Wager",
  description: "P2P Wager betting platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${splineSans.variable} ${notoSans.variable} antialiased bg-background text-text transition-colors duration-500 font-spline`}
      >
        <Toaster position="bottom-right" />

        <Providers>{children}</Providers>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
