const express = require('express');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Config env file
require('dotenv').config();

// Create node server
const { createServer } = require('node:http');

// Import SocketIo server
const { Server } = require("socket.io");

// Import Controllers
const { readPerosnalMessages } = require('./controller/messageReaderController');
const { readGroupMessages } = require('./controller/groupMessageReaderController');
const { downloadFile } = require('./controller/downloadFile');

// Import SocketIo Handlers
const disconnectHandler = require('./socketIoHandlers/disconnectHandler');
const personalMessageHanlder = require('./socketIoHandlers/personalMessageHandler');
const uploadHandler = require('./socketIoHandlers/uploadHandler');

// Db handlers
const { readUsers, updateUser } = require('./utils/usersCollectionHandler');
const { readGroupMessage, createGroupMessage } = require('./utils/groupMessageCollectionHandler');

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
  },
  maxHttpBufferSize: 1e8 // 100 MB
});

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

      // To add unique users to the db
      await updateUser(userName, userObj);

      const parsedObjects = await readUsers();
      // console.log("parsedObjects",parsedObjects)

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

      // Send individual files with messages
      socket.on("send_file", async(file) => {
        const messageObject = await uploadHandler(file);
        const messageSender = await personalMessageHanlder(socket,messageObject,userName);
        console.log("messageSender messge id",messageSender);
      });

      let senderGlobal = null;
      // Group Messaging
      socket.on('join_group', async( message ) => {
        // console.log("message",message);
    
        const room = message.room;
        const sender = message.sender;

        socket.join(room);

        const returnObj  = {
          sender : sender,
          message_others : `${sender} has joined!`,
          message_self : `Welocome to ${room}`
        }

        // Send message to all connected in the room
        if (senderGlobal === null){
          ioInstance.in(room).emit("receive_welcome_message", returnObj);
          senderGlobal = sender;
        }
      
        socket.on('send_group_message',async( group_message_obj ) => {
          console.log("group_message_obj",group_message_obj);

          socket.emit("receive_group_message", group_message_obj);
          // Broadcast to whoever is in the channel
          socket.broadcast.to(group_message_obj.room).emit("receive_group_message", group_message_obj);
  
          const groupMessageObj = await createGroupMessage(group_message_obj);
          console.log("groupMessageObj",groupMessageObj);
        });
        // send_file
        socket.on("send_group_file", async(file) => {
          const messageObject = await uploadHandler(file);
          const messageSender = await personalMessageHanlder(socket,messageObject,userName);
          console.log("messageSender messge id",messageSender);
        });
      });

  } catch (error) {
    console.error("Error while using websockets: ",error);
  }
    
});

mongoose.connect(process.env.MONGO_DB_CONN_STRING)
  .then(() => console.log('Connected to',process.env.MONGO_DB_CONN_STRING))
  .catch(err => console.error("Error while connecting to Mongodb: ",err));

app.get('/', async(req, res) => {
  const result = await readGroupMessage();
  const existingUser = await readUsers();
  // console.log("existingUser",existingUser)

  // console.log("result",result)
  res.json({ GroupMessages:result ,userList:existingUser});
});

server.listen(port,'0.0.0.0', () => {
  console.log('server running at http://localhost:3000');

  // Define API routes here
  app.post('/api/read_messages',readPerosnalMessages);
  app.post('/api/read_group_messages',readGroupMessages);
  app.post("/api/download", downloadFile);
});