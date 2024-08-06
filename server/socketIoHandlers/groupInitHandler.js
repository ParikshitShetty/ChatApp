const groupInitHandler = async({ message , ioInstance , socket, senderGlobal}) => {
    try {
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
          return sender;
        }
        return null;         
    } catch (error) {
        console.error("Error while group initial action :", error)
    }
}

module.exports = groupInitHandler;