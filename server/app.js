const express = require('express')
const app = express()
const port = 4000
const cors = require('cors')
app.use(cors())

const clients = new Set();
const WebSocket = require('ws');
const { uuid } = require('uuidv4')

const server = app.listen(port, () => {
    console.log('Server started on port 4000');
  });
  
  const wss = new WebSocket.Server({ server });


wss.on("connection", ws => {

    console.log("new client connected");
    clients.add(ws);
 
    // sending message to client
    ws.send('Welcome, you are connected!');
 
    //on message from client
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
        ws.send(data);
        console.log(`sent data back to client`)
    });
    
 
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has disconnected");
        clients.delete(ws)
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});

console.log("The WebSocket server is running on port 8080");

const sendToAllClients = (data) =>{
    clients.forEach((client) => {
      client.send(data);
    });
    //console.log(clients.keys())
  }


app.get('/', (req, res) => {
    res.json('home')
  }) 

  app.get('/send', (req, res) => {
    sendToAllClients('This message is sent to all clients!')
    res.json('data sent to all clients!')
  }) 
  
//   app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
//   })