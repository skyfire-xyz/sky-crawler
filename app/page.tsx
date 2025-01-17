"use client"

// import "@/src/globals.css";
import { useEffect, useState } from "react"
import Pusher from "pusher-js"
import { v4 as uuidv4 } from "uuid"

import CrawlLog from "./components/CrawlLog"
import CrawlSummary from "./components/CrawlSummary"
import PaymentLog from "./components/PaymentLog"
import SearchBar from "./components/SearchBar"
import SettingsBar from "./components/SettingsBar"
// import "./App.css";
import { Alert, AlertType, DEFAULT_USER_AGENT, MessageData } from "./types"

const channelId = uuidv4()

export default function App() {
  const [currentSite, setCurrentSite] = useState<MessageData>()
  const [summary, setSummary] = useState<MessageData>()
  const [userAgent, setUserAgent] = useState(DEFAULT_USER_AGENT)
  const [depth, setDepth] = useState<string | undefined>(undefined)
  const [payment, setPayment] = useState<string | undefined>(undefined)
  const [log, setLog] = useState<MessageData[]>([])
  const [payments, setPayments] = useState<MessageData[]>([])
  const [receipts, setReceipts] = useState<MessageData[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isMediumScreen, setIsMediumScreen] = useState(true)

  const handleDepthChange = (newDepth: string) => {
    setDepth(newDepth)
  }

  const handlePaymentChange = (newPayment: string) => {
    setPayment(newPayment)
  }

  const handleUAChange = (newUA: string) => {
    setUserAgent(newUA)
  }

  const handleSearch = () => {
    setLog([])
    setPayments([])
    setReceipts([])
    setAlerts([])
    setSummary(undefined)
  }

  const pusherApiKey = process.env.NEXT_PUBLIC_PUSHER_KEY || ""
  useEffect(() => {
    setDepth(undefined)
    setPayment(undefined)
    setUserAgent(DEFAULT_USER_AGENT)
    const pusher = new Pusher(pusherApiKey, {
      cluster: "us3",
    })
    const channel = pusher.subscribe(channelId)
    channel.bind("crawler-event", (data: { message: MessageData }) => {
      // console.log(data)
      if (data.message !== undefined) {
        switch (data.message.type) {
          case "summary":
            setSummary(data.message)
            break
          case "error":
          case "page":
            setCurrentSite(data.message)
            setLog((prevLog) => [data.message, ...prevLog])
            break
          case "payment":
            setPayments((prevPayments) => [data.message, ...prevPayments])
            break
          case "receipt":
            setReceipts((prevReceipts) => [data.message, ...prevReceipts])
            break
        }
      }
    })
    return () => {
      pusher.unsubscribe(channelId)
    }
  }, [])

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMediumScreen(window.innerWidth >= 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return (
    <div className="flex h-full flex-col">
      <div className="relative h-[60px] md:h-[220px] w-full">
        <img
          src="/crawler-image-banner.svg"
          alt="Crawler Banner"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
          <h1 className="text-xl md:text-4xl font-extrabold leading-none tracking-tight text-white dark:text-white lg:text-6xl">
            Payment-Powered Website Crawling
          </h1>
          {isMediumScreen && (
            <h4 className="text-lg md:text-2xl font-normal text-white dark:text-white">
              Pay a crawling AI agent to access payment-restricted web pages.
            </h4>
          )}
        </div>
      </div>
      <div className="h-2 md:h-6 w-full bg-blue-800"></div>
      <div className="h-5" />
      <div className="container mx-auto px-4">
        <div className="md:relative flex items-center justify-center mb-8">
          <SearchBar
            onSearch={handleSearch}
            channelId={channelId}
            inputDepth={depth}
            inputPayment={payment}
            ua={userAgent}
            setAlerts={setAlerts}
          />
          <div className="absolute top-4 right-4 z-50 md:absolute md:top-2 md:right-0">
            <SettingsBar
              onDepthChange={handleDepthChange}
              onPaymentChange={handlePaymentChange}
              onUAChange={handleUAChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <CrawlLog log={log} errorMessages={alerts} />
          </div>
          <div>
            <CrawlSummary summary={summary} />
            <PaymentLog payments={payments} receipts={receipts} />
          </div>
        </div>
      </div>
    </div>
  )
}
