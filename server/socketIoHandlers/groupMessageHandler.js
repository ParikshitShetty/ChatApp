const { createGroupMessage } = require('../utils/groupMessageCollectionHandler')

const groupMessageHanlder = async(socket,group_message_obj) =>{
    try {
        socket.emit("receive_group_message", group_message_obj);
        // Broadcast to whoever is in the channel
        socket.broadcast.to(group_message_obj.room).emit("receive_group_message", group_message_obj);

        const groupMessageObj = await createGroupMessage(group_message_obj);
        console.log("groupMessageObj",groupMessageObj);
    } catch (error) {
        console.error("Error while group Messaging: ",error);
    }
}

module.exports = groupMessageHanlder;