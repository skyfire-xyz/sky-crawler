import type { Metadata } from "next";
import "@/src/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Flowbite, ThemeModeScript } from "flowbite-react";
import theme from "@/src/flowbite-theme";
import { ToastContainer } from "react-toastify";
import { Instrument_Sans } from "next/font/google";
import TopBar from "./components/TopBar";

export const metadata: Metadata = {
  title: "LearnerBot: Payment-Powered Website Crawling",
  description: "",
};

const instrument = Instrument_Sans({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin-ext"],
  variable: "--font-instrument",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang="en" className="bg-html">
      <head>
        <ThemeModeScript />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Teko:wght@300..700&display=swap"
            rel="stylesheet"
          />
        </head>
      </head>
      <body className={`${instrument.variable} bg-body font-instrument`}>
        <Flowbite theme={{ theme }}>
          <TopBar />
          {children}
          <ToastContainer position="bottom-right" autoClose={6000} />
        </Flowbite>
      </body>
    </html>
  );
}
