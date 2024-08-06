"use client";

import "@/src/globals.css";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import ShowTextButton from "./components/ShowTextButton";
import { v4 as uuidv4 } from "uuid";

const channelId = uuidv4().toString();

const LogList = ({ log }: { log: MessageData[] }) => (
  <div className="grow rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
    <h2 className="mb-2 text-xl font-bold dark:text-white">
      Crawled Data Logs
    </h2>
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

const PaymentLog = ({
  payments,
  receipts,
}: {
  payments: MessageData[];
  receipts: MessageData[];
}) => (
  <div className="w-1/3 rounded-lg border border-blue-800 bg-gray-900 p-4 text-white dark:border-gray-300 dark:bg-white dark:text-gray-900">
    <h2 className="mb-2 text-xl font-bold">Payment Protocol Logs</h2>
    <ul>
      {payments.concat(receipts).map((log, index) => (
        <li key={index} className="mb-1.5 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-col">
              {log.type === "payment" ? (
                <span className="text-cyan-500 dark:text-blue-300">
                  {log.senderUsername} paid {log.amount} USD to{" "}
                  {log.receiverUsername}
                </span>
              ) : (
                <span className="text-lime-500 dark:text-green-400">
                  {log.senderUsername} paid {log.amount} USD to{" "}
                  {log.receiverUsername}
                </span>
              )}
              {log.type === "payment" && (
                <div className="flex items-center">
                  <span className="mr-3 text-xs text-gray-300">
                    Access granted to {log.path}
                  </span>
                </div>
              )}
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
  senderUsername: string;
  receiverUsername: string;
  path: string;
}

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

  const combinedLogs = [...payments, ...receipts];

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
        <SearchBar onSearch={handleSearch} channelId={channelId} />
      </div>
      <div className="grow p-4">
        <div className="flex space-x-4">
          <LogList log={log} />
          <PaymentLog payments={payments} receipts={receipts} />
        </div>
      </div>
    </div>
  );
}
