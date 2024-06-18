const express = require('express');
const app = express()
const { Server } = require("socket.io");
const cors = require('cors')
const bodyParser = require('body-parser')

const { createServer } = require('node:http');

const port = 3000;
const server = createServer(app);

app.use(cors());
// Use body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const io = new Server(server,{
    cors:{
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
  });

  app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
  });

server.listen(port, () => {
  console.log('server running at http://localhost:3000');
});