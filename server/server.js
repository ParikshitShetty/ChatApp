const express = require('express');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

const { createServer } = require('node:http');

// Import singleton
const singleton = require('./socketIoSingleton');

// redisClient connection
const redisClient = require('./redisClient');

// Import common functions
const { usersGetter } = require('./common/usersGetter');

// Import Controllers
const { readMessages } = require('./controller/messageReaderController');

const port = 3000;
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
// const ioInstance = singleton(server);

const { Server } = require("socket.io");
const ioInstance = new Server(server, {
  cors: {
      origin: '*',
      methods: ['GET', 'POST'],
  }
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

      // To add unique users to the cache
      await redisClient.hSet('Users', userName, userObj);

      const parsedObjects = await usersGetter();

      socket.join(chatID);

      const parsedUser = JSON.parse(userObj)
      // Send the current users userId
      socket.emit('current_user',parsedUser)
      // Sending userslist to all the users connected
      ioInstance.emit('users_list',{ usersList:parsedObjects })

      socket.on('disconnect', async() => {
        socket.leave(chatID);
        console.log("Disconnected: ",chatID);

        // Convert json string to objects and convert it back to string since redis only stores strings
        userObj = JSON.parse(userObj);
        userObj.status = 'offline';
        userObj = JSON.stringify(userObj);

        // Update the status in redis
        await redisClient.hSet('Users', userName, userObj);

        const objectsOnDisconnect = await usersGetter();
        // Broadcast the updated users list to all clients
        ioInstance.emit('users_list', { usersList: objectsOnDisconnect });
      })

      socket.on('send_message', async( message ) => {
        // console.log("message",message)

        const messageObj = {
          receiverChatID : message.receiverChatID,
          senderChatID : message.senderChatID,
          content : message.content
        }

        // Send message to only that particular room/user
        socket.in(messageObj.receiverChatID).emit('receive_message',messageObj)

        const redisMsgObj = {
          senderUserName : userName,
          recieverUserName : message.recieverUserName,
          content : message.content
        }
        // console.log("redisMsgObj",redisMsgObj)

        // Add the message in redis cache
        await redisClient.xAdd('Messages', '*', redisMsgObj);
      })

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
});