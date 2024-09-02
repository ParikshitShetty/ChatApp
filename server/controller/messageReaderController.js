const { readMessage } = require('../utils/messageCollectionHandler');
const { fileEncryptor } = require('../utils/fileEncryptor');

const readPerosnalMessages = async(req, res) => {
    const { reciever, sender } = req.body;
    try {
      // console.log("reciever",reciever,'sender',sender)
      const messages = await readMessage();

      const filteredMessages =  messages.filter(message => ((message.senderUserName === sender && message.recieverUserName === reciever) || (message.senderUserName === reciever && message.recieverUserName === sender)) 
      );
      // Spread Operator
      // Object.assign()
      // These methods give us an array with meta data format only parse method works

      const newMessages = filteredMessages.map( message => fileEncryptor({ message }));

      res.json({ filteredMessages : newMessages });
    } catch (error) {
      console.error("Error readin individual messages: ",error)
      res.json({message:"Error while reading messages from Mongodb",error:error})
    }
};

module.exports = { readPerosnalMessages };