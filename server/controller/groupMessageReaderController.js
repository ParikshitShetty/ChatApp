const { readGroupMessage } = require('../utils/groupMessageCollectionHandler');

const readGroupMessages = async(req, res) => {
    const { reciever, sender } = req.body;
    try {
      const messages = await readGroupMessage();

      res.json({ messages});
    } catch (error) {
      res.json({message:"Error while reading messages from redis",error:error})
    }
};

module.exports = { readGroupMessages };