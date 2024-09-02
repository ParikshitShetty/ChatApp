const { fileEncryptor } = require('../utils/fileEncryptor');
const { createMessage } = require('../utils/messageCollectionHandler')

const personalMessageHanlder = async(socket,message,userName) =>{
    try {
        const messageObj = {
            recieverUserName : message.recieverUserName,
            senderUserName : message.senderUserName,
            content : message.content
        }
        if (message?.path) {
            for (let index = 0; index < message?.path.length; index++) {
                const element = message?.path[index];
                const returnedMessage = await fileEncryptor({ message:{ path: element} });

                let finalMessage;
                if (index === 0) finalMessage = { ...messageObj , ...returnedMessage};
                else finalMessage = {...returnedMessage}
                socket.in(messageObj.recieverUserName).emit('receive_message',finalMessage) 
            }
        } else {
            // Send message to only that particular room/user
            socket.in(messageObj.recieverUserName).emit('receive_message',messageObj)

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
        }
        
        for (let index = 0; index < message?.path.length; index++) {
            const path = message?.path[index] ?? null;
            const MsgObj = {
                senderUserName : userName,
                recieverUserName : message.recieverUserName,
                content : message.content,
                path: path 
              }
              // console.log("MsgObj",MsgObj)
              // Add the message in db
              const adder = createMessage(MsgObj);
        }
        return;
    } catch (error) {
        console.error("Error while one-on-one Messaging: ",error);
    }
}

module.exports = personalMessageHanlder;