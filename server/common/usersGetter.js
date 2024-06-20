const redisClient = require('../redisClient');

const usersGetter = async() =>{
    try {
        // To send the list of unique users
        const existingUser = await redisClient.hGetAll('Users');

        // Parsing values to send the list of users present
        const userValues = Object.values(existingUser);
        const parsedObjects = userValues.map(JSON.parse);

        return parsedObjects
    } catch (error) {
        console.error("Error while reading redis",error)
    }
}

module.exports = { usersGetter };