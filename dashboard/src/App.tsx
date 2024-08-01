import React, { useEffect, useState } from 'react';
import Collapsible from './utils/collapsible';

const App: React.FC = () => {
  const [currentSite, setCurrentSite] = useState<string>('');
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {

      const message = event.data.toString();
      console.log("received message: ", message)
      
      setCurrentSite(message);
      setLog(prevLog => [message, ...prevLog]);
      
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>Web Crawler Dashboard</h1>
      <div>
        <h2>Currently Crawling:</h2>
        {<Collapsible text={currentSite} maxLength={200} />}
      </div>
      <div>
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
  );
}

export default App;