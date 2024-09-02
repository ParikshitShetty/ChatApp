const { fileEncryptor } = require('../utils/fileEncryptor');
const { createGroupMessage } = require('../utils/groupMessageCollectionHandler')

const groupMessageHanlder = async(socket,group_message_obj) =>{
    try {
        if (!group_message_obj?.path) {
            const MsgObj = {
                ...group_message_obj,
                path: group_message_obj?.path ?? null
            }
            // console.log("MsgObj",MsgObj)

            socket.emit("receive_group_message", group_message_obj);
            // Broadcast to whoever is in the channel
            socket.broadcast.to(group_message_obj.room).emit("receive_group_message", MsgObj);
            // Add the message in db
            const groupMessageObj = await createGroupMessage(MsgObj);
            // console.log("groupMessageObj",groupMessageObj);
            return groupMessageObj; 
        }
        
        for (let index = 0; index < group_message_obj?.path.length; index++) {
            const path = group_message_obj?.path[index] ?? null;
            const Obj = { ...group_message_obj, path };
            const finalMessage = await fileEncryptor({ message : Obj });
            
            if(index !== 0 && finalMessage.content) delete finalMessage.content;

            socket.emit("receive_group_message", finalMessage);
            // Broadcast to whoever is in the channel
            socket.broadcast.to(group_message_obj.room).emit("receive_group_message", finalMessage);
            // console.log("MsgObj",MsgObj)
            // Add the message in db
            const adder = createGroupMessage(group_message_obj);
        }
        return;
    } catch (error) {
        console.error("Error while group Messaging: ",error);
    }
}

module.exports = groupMessageHanlder;