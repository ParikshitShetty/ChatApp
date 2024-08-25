// Db hanlders
const { updateUser, readUsers } = require('../utils/usersCollectionHandler');

const disconnectHandler = async(socket,ioInstance,userName,userObj) =>{
    try {
        socket.leave(userName);
        console.log("Disconnected: ",userName);

        userObj = JSON.parse(userObj);
        userObj.status = 'offline';
        userObj = JSON.stringify(userObj);

        console.log("userObj disconnect",userObj)
        // Update the status in db
        await updateUser(userName,userObj)

        const objectsOnDisconnect = await readUsers();
        // Broadcast the updated users list to all clients
        const disconnect_emit = ioInstance.emit('users_list', { usersList: objectsOnDisconnect });
        return disconnect_emit;
    } catch (error) {
        console.error("Error while disconnecting: ",error);
    }
}

module.exports = disconnectHandler;