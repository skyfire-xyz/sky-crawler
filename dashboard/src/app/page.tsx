"use client";

import "@/src/globals.css";
import React, { useEffect, useState } from "react";
import Collapsible from "./components/collapsible";
import "./App.css";
import { Accordion, Button } from "flowbite-react";

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
  const [log, setLog] = useState<string[]>([]);
  const [payments, setPayments] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const message = event.data.toString();
      console.log("received message: ", message);

      if (message.startsWith("Paid") || message.startsWith("Payment")) {
        setPayments((prevPayments) => [message, ...prevPayments]);
      } else {
        if (isJSON(message)) {
          setLog((prevLog) => [message, ...prevLog]);
        } else {
          setCurrentSite(message);
          setLog((prevLog) => [message, ...prevLog]);
        }
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
    <>
      <div className="container">
        <div className="main-content">
          <h1 className="header">Web Crawler Dashboard</h1>
          <div className="section">
            <h2>Currently Crawling:</h2>
            <Collapsible text={currentSite} maxLength={200} />
          </div>
          <div className="section">
            <h2>Log:</h2>
            <ul>
              {log.map((site, index) => (
                <li key={index}>
                  <Collapsible text={site} maxLength={200} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="sidebar">
          <h2 className="header">Payment Protocol Logs</h2>
          <ul>
            {payments.map((payment, index) => (
              <li key={index}>{payment}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3>Flowbite UI Test</h3>
        <Button>Button</Button>
        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title>What is Flowbite?</Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Flowbite is an open-source library of interactive components
                built on top of Tailwind CSS including buttons, dropdowns,
                modals, navbars, and more.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Check out this guide to learn how to&nbsp;
                <a
                  href="https://flowbite.com/docs/getting-started/introduction/"
                  className="text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  get started&nbsp;
                </a>
                and start developing websites even faster with components on top
                of Tailwind CSS.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>Is there a Figma file available?</Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Flowbite is first conceptualized and designed using the Figma
                software so everything you see in the library has a design
                equivalent in our Figma file.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Check out the
                <a
                  href="https://flowbite.com/figma/"
                  className="text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  Figma design system
                </a>
                based on the utility classes from Tailwind CSS and components
                from Flowbite.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>
              What are the differences between Flowbite and Tailwind UI?
            </Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                The main difference is that the core components from Flowbite
                are open source under the MIT license, whereas Tailwind UI is a
                paid product. Another difference is that Flowbite relies on
                smaller and standalone components, whereas Tailwind UI offers
                sections of pages.
              </p>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                However, we actually recommend using both Flowbite, Flowbite
                Pro, and even Tailwind UI as there is no technical reason
                stopping you from using the best of two worlds.
              </p>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Learn more about these technologies:
              </p>
              <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
                <li>
                  <a
                    href="https://flowbite.com/pro/"
                    className="text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Flowbite Pro
                  </a>
                </li>
                <li>
                  <a
                    href="https://tailwindui.com/"
                    rel="nofollow"
                    className="text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Tailwind UI
                  </a>
                </li>
              </ul>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>
    </>
  );
}
