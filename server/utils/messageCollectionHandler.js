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
        console.log("createMessage message",message)

        const parsedObject = JSON.parse(message);
        // Check the type of userData
        if (typeof parsedObject !== 'object') throw new Error("Input data must be an object");

        const details = new messageModel(parsedObject)
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

const updateMessage = async(userName,newData) => {
    try {
        console.log("userName",userName,"newData",newData)
        const messageData = await messageModel.findOne({ userName }).exec();
        console.log("messageData",messageData)
        if (messageData && messageData.length > 0){
            console.log("Updating user")
            const updatedMessage = await messageModel.updateOne({...usersData}, {...newData}).updatedMessage();
            return updatedMessage;
        } 
        console.log("user doesn't exist");
        const createdMessage = await createMessage(newData);
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