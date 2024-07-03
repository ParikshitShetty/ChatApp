// redisClient connection
const redisClient = require('../redisClient');

const readMessages = async(req, res) => {
    const { reciever, sender } = req.body;
    try {
      // console.log("reciever",reciever,'sender',sender)
      const messages = await redisClient.xRange('Messages', '-', '+');

      const filteredMessages =  messages.filter(message => ((message.message.senderUserName === sender && message.message.recieverUserName === reciever) || (message.message.senderUserName === reciever && message.message.recieverUserName === sender)) 
      );
      // ).map(message => message.message);

      // console.log("filteredMessages",filteredMessages)
      res.json({ filteredMessages:filteredMessages});
    } catch (error) {
      console.error("Error readin individual messages: ",error)
      res.json({message:"Error while reading messages from redis",error:error})
    }
};

module.exports = { readMessages };