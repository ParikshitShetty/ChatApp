const redisClient = require('../redisClient');
// Db hanlders
const { readUsers } = require('../utils/usersCollectionHandler');

// existingUser [Object: null prototype] {
//     [0]   fg: '{"chatID":"x8veudY_KPVThMUuAABP","userName":"fg","status":"offline"}',
//     [0]   pcs: '{"chatID":"GYRvOMX76noCp2LxAABF","userName":"pcs","status":"offline"}',
//     [0]   striker: '{"chatID":"MosifIXGz72U4J8JAAAH","userName":"striker","status":"offline"}',
//     [0]   vader: '{"chatID":"pzzzHTLPJfbwdqZ3AAAD","userName":"vader","status":"online"}',
//     [0]   yo: '{"chatID":"1RdSOC5CsRJ4CybjAAAB","userName":"yo","status":"offline"}',
//     [0]   pvs: '{"chatID":"OwDNsPJyRu3_VLWdAAAB","userName":"pvs","status":"offline"}'
//     [0] }
const usersGetter = async() =>{
    try {
        // To send the list of unique users
        // const existingUser = await redisClient.hGetAll('Users');
        const existingUser = await readUsers();
        // console.log("existingUser",existingUser)

        // Parsing values to send the list of users present
        // const userValues = Object.values(existingUser);
        // const parsedObjects = userValues.map(JSON.parse);

        return existingUser
    } catch (error) {
        console.error("Error while reading redis",error)
    }
}

module.exports = { usersGetter };