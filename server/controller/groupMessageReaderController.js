const { fileEncryptor } = require('../utils/fileEncryptor');
const { readGroupMessage } = require('../utils/groupMessageCollectionHandler');

const readGroupMessages = async(req, res) => {
    const { reciever, sender } = req.body;
    try {
      let messages = await readGroupMessage();

      // Promise.all is used to handle multiple promises concurrently 
      // It ensures all the promises are resolved before moving forward
      messages = await Promise.all([...messages].map( message => fileEncryptor({ message })));

      res.json({ messages });
    } catch (error) {
      console.log("Error while reading group messages from mongofb: ",error)
      res.json({message:"Error while reading group messages from mongofb",error:error})
    }
};

module.exports = { readGroupMessages };