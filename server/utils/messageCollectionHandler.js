const { messageModel } = require('../models/messageModel');

const readMessage = async() => {
    try {
        const messageData = await messageModel.find().exec();
        console.log("messageData",messageData)
        return messageData;
    } catch (error) {
        console.error("Error while reading messages:",error);
    }
};

const createMessage = async(message) => {
    try {
        // console.log("createMessage message",message);

        // Check the type of userData
        if (typeof message !== 'object') throw new Error("Input data must be an object");

        const details = new messageModel(message)
        console.log("details",details);
        const createdMessage = await details.save();
        console.log("createdMessage",createdMessage)
        return createdMessage;
    } catch (error) {
        console.error("Error while creating message:",error);
    }
}

const deleteMessage = async({ userName }) => {
    try {
        const deletedMessage = await messageModel.deleteOne({ userName });
        console.log("deletedMessage",deletedMessage);
        return deletedMessage;
    } catch (error) {
        console.error("Error while deleting message:",error);
    }
}

// In progress
const updateMessage = async(newMessage) => {
    try {
        console.log("newMessage",newMessage)
        const message = await messageModel.findOne({ senderUserName:newMessage.senderUserName }).exec();
        console.log("message",message)
        if (message && message.length > 0){
            console.log("Updating user")
            const updatedMessage = await messageModel.updateOne({...message}, {...newMessage}).updatedMessage();
            return updatedMessage;
        } 
        console.log("user doesn't exist");
        const createdMessage = await createMessage(newMessage);
        return createdMessage;
    } catch (error) {
        console.error("Error while updating message:",error);
    }
}

module.exports = { 
    readMessage,
    createMessage,
    deleteMessage,
    updateMessage
};