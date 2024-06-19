const express = require('express');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

const { createServer } = require('node:http');

// Import singleton
const singleton = require('./socketIoSingleton');

const port = 3000;
const server = createServer(app);

app.use(cors());
// Use body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create an instance of the socketio
// const ioInstance = singleton(server);

const { Server } = require("socket.io");
const ioInstance = new Server(server, {
  cors: {
      origin: '*',
      methods: ['GET', 'POST'],
  }
});

let usersList = [];

ioInstance.on('connection', socket => {
    const chatID = socket.id;

    console.log(`A user connected with id ${chatID}`);
    // Add the user to the array
    usersList.push(chatID);
    
    socket.join(chatID);

    socket.emit('users_list',{ currentUser:chatID, usersList:usersList })

    socket.on('disconnect', () => {
      socket.leave(chatID);
      console.log("Disconnected: ",chatID);

      const index = usersList.indexOf(chatID)
      // Remove the user from current user list
      usersList.splice(index,1)
    })

    socket.on('send_message', message => {
      console.log("message",message)

      receiverChatID = message.receiverChatID
      senderChatID = message.senderChatID
      content = message.content

      // Send message to only that particular room
      socket.in(receiverChatID).emit('receive_message', {
          'content': content,
          'senderChatID': senderChatID,
          'receiverChatID':receiverChatID,
      })
    })

    // socket.on('message',(message)=>{
    //   console.log("message",message);
    // });
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(port, () => {
  console.log('server running at http://localhost:3000');
});