"use client";

import "@/src/globals.css";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import ShowTextButton from "./components/ShowTextButton";

const LogList = ({ log }: { log: MessageData[] }) => (
  <div className="flex-grow rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
    <h2 className="mb-2 text-xl font-bold dark:text-white">Crawled Data</h2>
    <ul>
      {log.map((entry, index) => (
        <li key={index} className="mb-1.5 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-col">
              <span className="text-gray-800 dark:text-gray-400">
                {entry.url}
              </span>
              <div className="flex items-center">
                <span className="mr-3 text-xs text-[#0D7490]">
                  [{entry.paid}]
                </span>
                <span className="mr-3 text-xs text-gray-500 dark:text-gray-300">
                  Characters: {entry.char}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  ({entry.time}ms)
                </span>
              </div>
            </div>
          </div>
          <ShowTextButton text={entry.text} />
        </li>
      ))}
    </ul>
  </div>
);

const PaymentLog = ({ payments }: { payments: MessageData[] }) => (
  <div className="w-1/3 rounded-lg border border-blue-800 bg-gray-900 p-4 text-white dark:border-gray-300 dark:bg-white dark:text-gray-900">
    <h2 className="mb-2 text-xl font-bold">Payment Protocol Logs</h2>
    <ul>
      {payments.map((payment, index) => (
        <li key={index} className="mb-1.5 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-col">
              <span className="text-gray-200 dark:text-gray-400">
                {payment.amount} USD paid to {payment.receiverUsername}
              </span>
              <div className="flex items-center">
                <span className="mr-3 text-xs text-[#0eb8c4]">
                  Access granted to {payment.path}
                </span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

interface MessageData {
  type: string;
  title: string;
  url: string;
  text: string;
  paid: string;
  char: string;
  time: string;

  amount: string;
  receiverUsername: string;
  path: string;
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
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          SkyCrawler
        </h1>
        <h4 className="text-2xl font-bold dark:text-white">
          Powered by Skyfire Payments
        </h4>
      </div>
      <div className="p-4">
        <SearchBar />
      </div>
      <div className="grow p-4">
        <div className="flex space-x-4">
          <LogList log={log} />
          <PaymentLog payments={payments} />
        </div>
      </div>
    </div>
  );
}
