"use client";

import "@/src/globals.css";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import "./App.css";
import Collapsible from "./components/collapsible";
import SearchBar from "./components/SearchBar";
import ShowTextButton from "./components/ShowTextButton";

const CrawlingStatus = ({ currentSite }: { currentSite: MessageData }) => (
          <div className="mb-4 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
          <h2 className="mb-2 text-xl font-bold dark:text-white">Currently Crawling:</h2>
          <p className="dark:text-white">{currentSite?.url}</p>
        </div>
);

const LogList = ({ log }: { log: MessageData[] }) => (
  <div className="grow rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
    <h2 className="mb-2 text-xl font-bold dark:text-white">Log:</h2>
    <ul>
      {log.map((entry, index) => (
        <li key={index} className="mb-2 flex items-center justify-between">
          <span className="dark:text-white">{entry.title}</span>
          <ShowTextButton text={entry.text} />
        </li>
      ))}
    </ul>
  </div>
);

const PaymentLog = ({ payments }: { payments: MessageData[] }) => (
  <div className="w-1/3 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
    <h2 className="mb-2 text-xl font-bold dark:text-white">Payment Protocol Logs</h2>
    <ul>
      {payments.map((payment, index) => (
        <li key={index} className="dark:text-white">{payment.text}</li>
      ))}
    </ul>
  </div>
);

interface MessageData {
  type: string;
  title: string;
  url: string;
  text: string;
}

export default function App() {
  const [currentSite, setCurrentSite] = useState<MessageData>();
  const [log, setLog] = useState<MessageData[]>([]);
  const [payments, setPayments] = useState<MessageData[]>([]);

  useEffect(() => {
    const pusher = new Pusher("6d4dae6cbd4c63819fb9", {
      cluster: "us3",
    });
    const channel = pusher.subscribe("my-channel");
    channel.bind("my-event", (data: { message: MessageData }) => {
      if (data.message !== undefined) {
        if (data.message.type === "page") {
          setCurrentSite(data.message);
          setLog((prevLog) => [data.message, ...prevLog]);
      } else {
          setPayments((prevPayments) => [data.message, ...prevPayments]);
      }
    }

    });
        return () => {
      pusher.unsubscribe("my-channel");
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="p-4">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          SkyCrawler
        </h1>
        <h4 className="text-2xl font-bold dark:text-white">Powered by Skyfire Payments</h4>
      </div>
      <div className="p-4">
        <SearchBar />
      </div>
      <div className="grow p-4">
        <CrawlingStatus currentSite={currentSite} />
        <div className="flex space-x-4">
          <LogList log={log} />
          <PaymentLog payments={payments} />
        </div>
      </div>
    </div>
  );
};