"use client";

import "@/src/globals.css";
import React, { useEffect, useState } from "react";
import ShowTextButton from './components/ShowTextButton'
import SearchBar from "./components/SearchBar";
import "./App.css";

function isJSON(message: string): boolean {
  try {
    JSON.parse(message);
    return true;
  } catch (e) {
    return false;
  }
}

export default function App() {
  const [currentSite, setCurrentSite] = useState<string>("");
  const [log, setLog] = useState<{ url: string; fullMessage: string }[]>([]);
  const [payments, setPayments] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const message = event.data.toString();
      console.log("Received message: ", message);

      if (message.startsWith("Paid") || message.startsWith("Payment")) {
        setPayments((prevPayments) => [message, ...prevPayments]);
      } else if (isJSON(message)) {
        try {
          const parsedMessage = JSON.parse(message);
          const { title, text, url } = parsedMessage;
          if (title && text && url) {
            setLog((prevLog) => [{ url, fullMessage: message }, ...prevLog]);
          }
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      } else {
        setCurrentSite(message);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          SkyCrawler
        </h1>
        <h4 className="text-2xl font-bold dark:text-white">Powered by Skyfire Payments</h4>
      </div>
      <div className="p-4">
        <SearchBar />
      </div>
      <div className="flex-grow p-4">
        <div className="flex space-x-4">
          <div className="flex-grow p-4 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600">
            <h2 className="text-xl font-bold mb-2 dark:text-white">Crawled Data</h2>
            <ul>
              {log.map((entry, index) => (
                <li key={index} className="flex items-center justify-between mb-2">
                  <span className="dark:text-white">{entry.url}</span>
                  <ShowTextButton text={entry.fullMessage} />
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/3 p-4 bg-gray-900 text-white border border-blue-800 rounded-lg dark:bg-white dark:text-gray-900 dark:border-gray-300">
            <h2 className="text-xl font-bold mb-2">Payment Protocol Logs</h2>
            <ul>
              {payments.map((payment, index) => (
                <li key={index} className="dark:text-white">{payment}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};