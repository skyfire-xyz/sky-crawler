import React, { useEffect, useState } from 'react';
import Collapsible from './utils/collapsible';
import './App.css';

const isJSON = (message: string): boolean => {
  try {
    JSON.parse(message);
    return true;
  } catch {
    return false;
  }
};

const App: React.FC = () => {
  const [currentSite, setCurrentSite] = useState<string>('');
  const [log, setLog] = useState<{ title: string; fullMessage: string }[]>([]);
  const [payments, setPayments] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
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
            setLog((prevLog) => [{ title, fullMessage: message }, ...prevLog]);
          }
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      } else {
        setCurrentSite(message);
        setLog((prevLog) => [{ title: message, fullMessage: message }, ...prevLog]);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      ws.close();
    };
  }, []);
  


  return (
    <div className="container">
      <div className="main-content">
        <h1 className="header">Web Crawler Dashboard</h1>
        <div className="section">
          <h2>Currently Crawling:</h2>
          <p> {currentSite} </p> {  }
        </div>
        <div className="section">
          <h2>Log:</h2>
          <ul>
          {log.map((entry, index) => (
            <li key={index}>
              <Collapsible title={entry.title} fullMessage={entry.fullMessage} />
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
  );
};

export default App;
