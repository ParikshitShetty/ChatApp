const { Server } = require("socket.io");

let ioInstance = null;

const singleton = (server) =>{
    if (!ioInstance) {
        ioInstance = new Server(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            }
        });
    }
    return ioInstance
}

module.exports =  singleton;