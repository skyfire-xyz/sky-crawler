"use client";

import "@/src/globals.css";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import { MessageData } from "./types";
import SearchBar from "./components/SearchBar";
import CrawlLog from "./components/CrawlLog";
import PaymentLog from "./components/PaymentLog";
import ApiInput from "./components/ApiInput";

const channelId = uuidv4().toString();

export default function App() {
  console.log("channelId: " + channelId);
  const [currentSite, setCurrentSite] = useState<MessageData>();
  const [log, setLog] = useState<MessageData[]>([]);
  const [payments, setPayments] = useState<MessageData[]>([]);
  const [receipts, setReceipts] = useState<MessageData[]>([]);

  const handleSearch = () => {
    setLog([]);
    setPayments([]);
    setReceipts([]);
  };

  useEffect(() => {
    const pusher = new Pusher("6d4dae6cbd4c63819fb9", {
      cluster: "us3",
    });
    const channel = pusher.subscribe(channelId);
    channel.bind("my-event", (data: { message: MessageData }) => {
      if (data.message !== undefined) {
        switch (data.message.type) {
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
      <div className="p-4">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          CrawlerBot
        </h1>
        <h4 className="text-2xl font-bold dark:text-white">
          Powered by Skyfire Payments
        </h4>
      </div>
      <div className="p-4">
        <div className="flex space-x-4">
          <SearchBar onSearch={handleSearch} channelId={channelId} />
          <ApiInput />
        </div>
      </div>
      <div className="grow p-4">
        <div className="flex space-x-4">
          <CrawlLog log={log} />
          <PaymentLog payments={payments} receipts={receipts} />
        </div>
      </div>
    </div>
  );
}
