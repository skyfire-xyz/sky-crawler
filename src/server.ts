import WebSocket, { WebSocketServer } from 'ws'


const wss = new WebSocketServer({ port: 8080 })

function broadcast(data: string): void {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    } else {
      console.error("Client not up")
    }
  });
}

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    if (Buffer.isBuffer(message)) {
      console.log("Received binary message");
      console.log(message.toString())
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      })
    } else {
      console.log("Received text message:", message);
      wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    }

    
  });

  ws.on('close', () => {
    console.log('Client disconnected')
  });
});

// For demonstration purposes: simulate broadcasting a message after 5 seconds
setTimeout(() => {
  broadcast('Server is now running and broadcasting!');
}, 5000);

console.log('WebSocket server started on ws://localhost:8080')