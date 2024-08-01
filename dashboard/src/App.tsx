import React, { useEffect, useState } from 'react';
import Collapsible from './utils/collapsible';
import './App.css';


function isJSON(message: string): boolean {
  try{
    JSON.parse(message)
    return true
  }
  catch(e){
    return false
  }
}

const App: React.FC = () => {
  const [currentSite, setCurrentSite] = useState<string>('');
  const [log, setLog] = useState<string[]>([]);
  const [payments, setPayments] = useState<string[]>([]);


  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {

      const message = event.data.toString();
      console.log("received message: ", message)
      
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
  );
};

export default App;