const express = require('express');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

const { createServer } = require('node:http');

// Import singleton
const singleton = require('./socketIoSingleton');

// redisClient connection
const redisClient = require('./redisClient');

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

ioInstance.on('connection', async(socket) => {
    const chatID = socket.id;
    const userName = socket.handshake.query.userName;

    console.log(`A user connected with id ${chatID}`);
    // Add the user to the array
    const userObj = {
      chatID : chatID,
      userName : userName
    }

    console.log("username",userName);

    usersList.push(userObj);

    const res = await redisClient.xAdd('Users', '*', userObj);
    console.log("res",res)
    
    socket.join(chatID);

    // Send the current users userId
    socket.emit('current_user',userObj)
    // Sending userslist to all the users connected
    ioInstance.emit('users_list',{ usersList:usersList })

    socket.on('disconnect', () => {
      socket.leave(chatID);
      console.log("Disconnected: ",chatID);

      const index = usersList.indexOf(chatID);
      // Remove the user from current user list
      usersList.splice(index,1)

      // Broadcast the updated users list to all clients
      ioInstance.emit('users_list', { usersList: usersList });
    })

    socket.on('send_message', async( message ) => {
      console.log("message",message)

      const messageObj = {
        receiverChatID : message.receiverChatID,
        senderChatID : message.senderChatID,
        content : message.content
      }

      // Send message to only that particular room/user
      socket.in(messageObj.receiverChatID).emit('receive_message',messageObj)
      const result = await redisClient.xAdd('Messages', '*', messageObj);
    })

});

app.get('/', async(req, res) => {
  const result = await redisClient.xRange('Messages', '-', '+');
  console.log("result",result)
res.json({message:"userList",data:result});
});

server.listen(port,'0.0.0.0', () => {
  console.log('server running at http://localhost:3000');
});