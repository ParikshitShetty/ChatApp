const express = require('express')
const app = express()
const port = 4000
const cors = require('cors')
//app.use(cors())

const clients = new Map();
const WebSocket = require('ws');

const server = app.listen(port, () => {
    console.log('The WebSocket server is running on port 4000');
  });
  
const wss = new WebSocket.Server({ server });


wss.on("connection", ws => {

    console.log("new client connected");

    const clientId = Math.random().toString(36).substring(7);

    clients.set(clientId,ws);
 
    // sending message to client
    ws.send('Welcome, you are connected!');
 
    //on message from client
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
        ws.send(data)
        console.log(`sent data back to client`)
    });
    
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has disconnected");
        clients.delete(clientId)
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
        
    }
    
});


const sendToClient = (clientId,data) =>{
    const client = clients.get(clientId)
    if(client && client.readyState === WebSocket.OPEN){
      client.send(data)
    }
    // clients.forEach((client) => {
    //   client.send(data);
    // });
    // console.log(clients.keys())
  }
  

  app.get('/', (req, res) => {
    res.json('home')

    // setInterval(() => {
    //   sendToAllClients("i'm back")
    // }, 1500);
  }) 

  app.get('/send/', (req,res) => {
    clients.forEach((client) => {
      client.send('hey');
      res.json(`sent to user`)
     });
  })

  app.get('/send/:clientId', (req, res) => {
    const {clientId} = req.params;
    const message = 'This message is sent to individual clients!';
    sendToClient(clientId,message)
    res.json(`data sent to ${clientId}!`)
    console.log('clients',clients.keys())
  }) 