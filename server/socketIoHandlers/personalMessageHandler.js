const { createMessage } = require('../utils/messageCollectionHandler')

const personalMessageHanlder = async(socket,message,userName) =>{
    try {
        const messageObj = {
            receiverChatID : message.receiverChatID,
            senderChatID : message.senderChatID,
            content : message.content
        }
        
        // Send message to only that particular room/user
        socket.in(messageObj.receiverChatID).emit('receive_message',messageObj)
    
        const MsgObj = {
          senderUserName : userName,
          recieverUserName : message.recieverUserName,
          content : message.content,
          path: message?.path ?? null
        }
        // console.log("MsgObj",MsgObj)
    
        // Add the message in db
        const adder = createMessage(MsgObj)
        return adder;
    } catch (error) {
        console.error("Error while one-on-one Messaging: ",error);
    }
}

module.exports = personalMessageHanlder;