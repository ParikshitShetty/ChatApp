const express = require('express');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
const { getFile } = require('./controller/getFile');

// Import SocketIo Handlers
const disconnectHandler = require('./socketIoHandlers/disconnectHandler');
const personalMessageHanlder = require('./socketIoHandlers/personalMessageHandler');
const groupMessageHandler = require('./socketIoHandlers/groupMessageHandler');
const uploadHandler = require('./socketIoHandlers/uploadHandler');
const groupInitHandler = require('./socketIoHandlers/groupInitHandler');

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
    credentials: true,
}));
// Use body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Passport configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
function(accessToken, refreshToken, profile, done) {
  // Here you would find or create a user in your database
  return done(null, profile);
}
));

// Serialize user (for session support, can be adjusted)
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Middleware to handle sessions
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS (secure cookies)
}));

app.use(passport.initialize());
app.use(passport.session());

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

      console.log("userName",userName)
      if (userName === '') return console.log("UserName is empty");

      console.log(`A user connected with id ${chatID} and userName ${userName}`);
      // Add the user to the array
      let userObj = {
        chatID : chatID,
        userName : userName,
        status: 'online'
      };

      // console.log("userObj",userObj);

      // To add unique users to the db
      await updateUser(userName, userObj);

      const parsedObjects = await readUsers();
      // console.log("parsedObjects",parsedObjects)

      socket.join(userName);

      // Send the current users userId
      socket.emit('current_user',userObj)
      // Sending userslist to all the users connected
      ioInstance.emit('users_list',{ usersList:parsedObjects })

      // Actions on disconnecting
      socket.on('disconnect', async() => {
        const dis = await disconnectHandler(socket,ioInstance,userName,userObj,userName);
        console.log("dis",dis);
      });

      // Individual Messaging
      socket.on('send_message', async( message ) => {
        // console.log("message",message)
        const messageSender = await personalMessageHanlder(socket,message,userName);
        // console.log("messageSender messge id",messageSender);
      });

      // Send individual files with messages
      socket.on("send_file", async(file) => {
        const messageObject = await uploadHandler(file);
        await personalMessageHanlder(socket,messageObject,userName);
      });

      let senderGlobal = null;
      // Group Messaging
      socket.on('join_group', async( message ) => {
        // console.log("message",message);
    
        const initialised = groupInitHandler({ message, ioInstance, socket, senderGlobal});
        if (initialised) senderGlobal = initialised;
      
        socket.on('send_group_message',async( group_message_obj ) => {
          await groupMessageHandler(socket, group_message_obj);
        });
        // send_file
        socket.on("send_group_file", async(file) => {
          console.log("yoooooooooo")
          const messageObject = await uploadHandler(file);
          await groupMessageHandler(socket, messageObject);
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

// Define API routes here
app.post('/api/read_messages',readPerosnalMessages);
app.post('/api/read_group_messages',readGroupMessages);
app.post('/api/download',downloadFile);
app.post('/api/get_image',getFile);

// Route to start the authentication process
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth callback URL
app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    const userName = req.user.displayName || req.user.name || 'User';

    const cookieOptions = {
      domain: 'localhost',
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false, //  use true if you don't want F.E to read it
      sameSite: 'Lax', // use None for production 
      path:'/'
    }
    // Successful authentication, redirect to the frontend or dashboard
    res.cookie('user',userName,cookieOptions).
    redirect(`http://localhost:5173/`);
  }
);

// Route to check if the user is authenticated
app.get('/auth/profile', (req, res) => {
  console.log("auth",req.isAuthenticated())
  if (!req.isAuthenticated()) return res.json({message:"User is not authenticated",redirect:true, url:'/auth/google'});

  res.json({ message:"User is authenticated", redirect:false, user:req.user}); // Display the user profile information
});

// Logout route
app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(()=>{
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.redirect('http://localhost:5173/login');
    })
  });
});

// Start Server
server.listen(port,'0.0.0.0', () => {
  console.log('server running at http://localhost:3000');
});