import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PopPredict - Decentralized Pop Culture Prediction Markets",
  description: "Bet on pop culture events with cryptocurrency. Powered by Stacks blockchain and Clarity smart contracts.",
  keywords: ["prediction markets", "stacks", "blockchain", "betting", "pop culture", "cryptocurrency"],
  authors: [{ name: "PopPredict Team" }],
  openGraph: {
    title: "PopPredict - Decentralized Pop Culture Prediction Markets",
    description: "Bet on pop culture events with cryptocurrency. Powered by Stacks blockchain.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
