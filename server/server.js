const express = require('express');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
// Config env file
require('dotenv').config();

// Create node server
const { createServer } = require('node:http');

// Import SocketIo server
const { Server } = require("socket.io");

// redisClient connection
const redisClient = require('./redisClient');

// Import common functions
const { usersGetter } = require('./common/usersGetter');

// Import Controllers
const { readMessages } = require('./controller/messageReaderController');
const { readGroupMessages } = require('./controller/groupMessageReaderController');

// Import SocketIo Handlers
const disconnectHandler = require('./socketIoHandlers/disconnectHandler');
const personalMessageHanlder = require('./socketIoHandlers/personalMessageHandler');

const port = process.env.SERVER_PORT;
const server = createServer(app);

app.use(cors({
    origin:[
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://192.168.1.5:5173/',
    'http://100.88.106.64:5173/',
    'http://172.23.240.1:5173/'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
// Use body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create an instance of the socketio
const ioInstance = new Server(server, {
  cors: {
      origin: '*',
      methods: ['GET', 'POST'],
  }
});

let users = [];
const addUser = (param) => {
  const { id, name, room } = param;
  console.log("id, name, room",id, name, room);
  if (!name || !room) return { error: "name and room required." };
  const user = { id, name, room };

  users.push(user);

  return { user };
};

ioInstance.on('connection', async(socket) => {
  try {
      const chatID = socket.id;
      const userName = socket.handshake.query.userName;

      console.log(`A user connected with id ${chatID}`);
      // Add the user to the array
      let userObj = JSON.stringify({
        chatID : chatID,
        userName : userName,
        status: 'online'
      });

      console.log("username",userName);

      // To add unique users to the cache
      await redisClient.hSet('Users', userName, userObj);

      const parsedObjects = await usersGetter();

      socket.join(chatID);

      const parsedUser = JSON.parse(userObj)
      // Send the current users userId
      socket.emit('current_user',parsedUser)
      // Sending userslist to all the users connected
      ioInstance.emit('users_list',{ usersList:parsedObjects })

      // Actions on disconnecting
      socket.on('disconnect', async() => {
        const dis = await disconnectHandler(socket,ioInstance,chatID,userObj,userName);
        console.log("dis",dis);
      });

      // Individual Messaging
      socket.on('send_message', async( message ) => {
        // console.log("message",message)
        const messageSender = await personalMessageHanlder(socket,message,userName);
        console.log("messageSender messge id",messageSender);
      });

      // Group Messaging
      socket.on('group_message', async( message ) => {
        console.log("message",message);

        const messageObj = {
          id : socket.id,
          room : message.room,
          sender : message.sender,
          // content : message.content
        };
        const obj = { id: socket.id, name:message.sender, room:message.room };
        // console.log("Object",{obj})

        // console.log("messageObj",messageObj);
        const { user, error } = addUser(obj);

        if (error) return console.log(error);

        socket.join(user.room);

        // console.log("user",user);
        
        socket.emit("receive_group_message", {
          user: message.sender,
          content: `Welocome to ${user.room}`,
        });
        // socket.broadcast.in(user.room)
        socket.broadcast.in(messageObj.room)
        .emit("receive_group_message", { user: message.sender, content: `${user.name} has joined!` });
      });

  } catch (error) {
    console.error("Error while using websockets: ",error);
  }
    
});

app.get('/', async(req, res) => {
  const result = await redisClient.xRange('Messages', '-', '+');
  const existingUser = await redisClient.hGetAll('Users');

  console.log("result",result)
  res.json({ MessagesList:result ,userList:existingUser});
});

server.listen(port,'0.0.0.0', () => {
  console.log('server running at http://localhost:3000');

  // Define API routes here
  app.post('/api/read_messages',readMessages);
  app.post('/api/read_group_messages',readGroupMessages);
});