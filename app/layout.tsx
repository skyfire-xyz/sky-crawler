import "@/styles/globals.css"
import { Metadata } from "next"
import { ToastContainer } from "react-toastify"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import SkyfireWidget from "@/lib/skyfire-sdk/components/skyfire-widget"
import { SkyfireProvider } from "@/lib/skyfire-sdk/context/context"
import { cn } from "@/lib/utils"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

import "react-toastify/dist/ReactToastify.css"
import TopBar from "./components/TopBar"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-white font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            forcedTheme="light"
          >
            <SkyfireProvider>
              <div className="relative flex min-h-screen flex-col">
                {/* <SkyfireWidget /> */}
                <TopBar />
                <div className="flex-1">{children}</div>
              </div>
              <TailwindIndicator />
              <ToastContainer />
            </SkyfireProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
