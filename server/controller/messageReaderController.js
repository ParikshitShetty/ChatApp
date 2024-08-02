// redisClient connection
const redisClient = require('../redisClient');

const { readMessage } = require('../utils/messageCollectionHandler');

const readPerosnalMessages = async(req, res) => {
    const { reciever, sender } = req.body;
    try {
      // console.log("reciever",reciever,'sender',sender)
      // const messages = await redisClient.xRange('Messages', '-', '+');

      // const filteredMessages =  messages.filter(message => ((message.message.senderUserName === sender && message.message.recieverUserName === reciever) || (message.message.senderUserName === reciever && message.message.recieverUserName === sender)) 
      // );
      // ).map(message => message.message);

      // console.log("filteredMessages",filteredMessages)
      const messages = await readMessage();

      const filteredMessages =  messages.filter(message => ((message.senderUserName === sender && message.recieverUserName === reciever) || (message.senderUserName === reciever && message.recieverUserName === sender)) 
      );

      console.log("messages",messages)

      res.json({ filteredMessages });
    } catch (error) {
      console.error("Error readin individual messages: ",error)
      res.json({message:"Error while reading messages from redis",error:error})
    }
};

module.exports = { readPerosnalMessages };