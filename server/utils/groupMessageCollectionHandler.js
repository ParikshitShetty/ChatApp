const { groupMessageModel } = require('../models/groupMessageModel');

const readGroupMessage = async() => {
    try {
        const messageData = await groupMessageModel.find().exec();
        console.log("messageData",messageData)
        return messageData;
    } catch (error) {
        console.error("Error while reading messages:",error);
    }
};

const createGroupMessage = async(message) => {
    try {
        // console.log("createGroupMessage message",message);

        // Check the type of userData
        if (typeof message !== 'object') throw new Error("Input data must be an object");

        const details = new groupMessageModel(message)
        console.log("details",details);
        const createdMessage = await details.save();
        console.log("createdMessage",createdMessage)
        return createdMessage;
    } catch (error) {
        console.error("Error while creating message:",error);
    }
}

const deleteGroupMessage = async({ userName }) => {
    try {
        const deletedMessage = await groupMessageModel.deleteOne({ userName });
        console.log("deletedMessage",deletedMessage);
        return deletedMessage;
    } catch (error) {
        console.error("Error while deleting message:",error);
    }
}

// In progress
const updateGroupMessage = async(newMessage) => {
    try {
        console.log("newMessage",newMessage)
        const message = await groupMessageModel.findOne({ senderUserName:newMessage.senderUserName }).exec();
        console.log("message",message)
        if (message && message.length > 0){
            console.log("Updating user")
            const updatedMessage = await groupMessageModel.updateOne({...message}, {...newMessage}).updatedMessage();
            return updatedMessage;
        } 
        console.log("user doesn't exist");
        const createdMessage = await createGroupMessage(newMessage);
        return createdMessage;
    } catch (error) {
        console.error("Error while updating message:",error);
    }
}

module.exports = { 
    readGroupMessage,
    createGroupMessage,
    deleteGroupMessage,
    updateGroupMessage
};