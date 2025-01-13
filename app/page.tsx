"use client";

// import "@/src/globals.css";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
// import "./App.css";
import { MessageData, AlertType, DEFAULT_USER_AGENT } from "./types";
import SearchBar from "./components/SearchBar";
import CrawlLog from "./components/CrawlLog";
import PaymentLog from "./components/PaymentLog";
import ApiInput from "./components/ApiInput";
import Alert from "./components/Alert";
import { v4 as uuidv4 } from "uuid";
import SettingsBar from "./components/SettingsBar";
import UAInput from "./components/UserAgentInput";

const channelId = uuidv4();

export default function App() {
  const [currentSite, setCurrentSite] = useState<MessageData>();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [userAgent, setUserAgent] = useState(DEFAULT_USER_AGENT);
  const [depth, setDepth] = useState<string | null>(null);
  const [payment, setPayment] = useState<string | null>(null);
  const [log, setLog] = useState<MessageData[]>([]);
  const [payments, setPayments] = useState<MessageData[]>([]);
  const [receipts, setReceipts] = useState<MessageData[]>([]);
  const [alerts, setAlerts] = useState<
    {
      type: AlertType;
      message: string;
    }[]
  >([]);

  const handleDepthChange = (newDepth: string) => {
    setDepth(newDepth);
  };

  const handlePaymentChange = (newPayment: string) => {
    setPayment(newPayment);
  };

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
  };

  const handleUAChange = (newUA: string) => {
    setUserAgent(newUA);
  };

  const handleSearch = () => {
    setLog([]);
    setPayments([]);
    setReceipts([]);
    setAlerts([]);
  };

  const pusherApiKey = process.env.NEXT_PUBLIC_PUSHER_KEY || "";
  useEffect(() => {
    setDepth("");
    setPayment("");
    setUserAgent(DEFAULT_USER_AGENT);
    const pusher = new Pusher(pusherApiKey, {
      cluster: "us3",
    });
    const channel = pusher.subscribe(channelId);
    channel.bind("crawler-event", (data: { message: MessageData }) => {
      console.log(data);
      if (data.message !== undefined) {
        switch (data.message.type) {
          case "error":
          case "page":
            setCurrentSite(data.message);
            setLog((prevLog) => [data.message, ...prevLog]);
            break;
          case "payment":
            setPayments((prevPayments) => [data.message, ...prevPayments]);
            break;
          case "receipt":
            setReceipts((prevReceipts) => [data.message, ...prevReceipts]);
            break;
        }
      }
    });
    return () => {
      pusher.unsubscribe(channelId);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative h-[280px] w-full">
        <img
          src="/crawler-image-banner.svg"
          alt="Crawler Banner"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white dark:text-white md:text-5xl lg:text-6xl">
            Payment-Powered Website Crawling
          </h1>
          <h4 className="text-2xl font-normal text-white dark:text-white">
            Pay a crawling AI agent to access payment-restricted web pages.
          </h4>
        </div>
      </div>
      <div className="h-6 w-full bg-blue-800"></div> <div className="h-5" />
      <div className="flex flex-col items-center space-y-4 p-5">
        <div className="flex w-full justify-center space-x-4">
          <SearchBar
            onSearch={handleSearch}
            channelId={channelId}
            apiKey={apiKey}
            inputDepth={depth}
            inputPayment={payment}
            ua={userAgent}
          />
          <ApiInput onApiKeyChange={handleApiKeyChange} />
          <SettingsBar
            onDepthChange={handleDepthChange}
            onPaymentChange={handlePaymentChange}
            onUAChange={handleUAChange}
          />
        </div>
      </div>
      <div className="grow p-5">
        <div className="flex space-x-4">
          <CrawlLog log={log} />
          <PaymentLog payments={payments} receipts={receipts} />
        </div>
      </div>
      <div>
        {alerts.map((alert, index) => (
          <Alert
            key={index}
            type={alert.type}
            message={alert.message}
            onClose={() =>
              setAlerts((prevAlerts) =>
                prevAlerts.filter((_, i) => i !== index),
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
