// redisClient connection
const redisClient = require('../redisClient');
// Common Functions
const { usersGetter } = require('../common/usersGetter');
// Db hanlders
const { updateUser } = require('../utils/usersCollectionHandler');

const disconnectHandler = async(socket,ioInstance,chatID,userObj,userName) =>{
    try {
        socket.leave(chatID);
        console.log("Disconnected: ",chatID);

        // Convert json string to objects and convert it back to string since redis only stores strings
        userObj = JSON.parse(userObj);
        userObj.status = 'offline';
        userObj = JSON.stringify(userObj);

        console.log("userObj disconnect",userObj)
        // Update the status in redis
        // await redisClient.hSet('Users', userName, userObj);
        await updateUser(userName,userObj)

        const objectsOnDisconnect = await usersGetter();
        // Broadcast the updated users list to all clients
        const disconnect_emit = ioInstance.emit('users_list', { usersList: objectsOnDisconnect });
        return disconnect_emit;
    } catch (error) {
        console.error("Error while disconnecting: ",error);
    }
}

module.exports = disconnectHandler;