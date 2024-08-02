// redisClient connection
const redisClient = require('../redisClient');

const { readUsers } = require('../utils/usersCollectionHandler')

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
    
        const redisMsgObj = {
          senderUserName : userName,
          recieverUserName : message.recieverUserName,
          content : message.content,
          path: message?.path ?? null
        }
        // console.log("redisMsgObj",redisMsgObj)
    
        // Add the message in redis cache
        // const adder = await redisClient.xAdd('Messages', '*', redisMsgObj);
        const adder = createMessage(redisMsgObj)
        return adder;
    } catch (error) {
        console.error("Error while one-on-one Messaging: ",error);
    }
}

module.exports = personalMessageHanlder;