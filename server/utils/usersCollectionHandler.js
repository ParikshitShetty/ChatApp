const { userModel } = require('../models/userModel');

const readUsers = async() => {
    try {
        const usersData = await userModel.find().exec();
        // console.log("usersData",usersData)
        return usersData;
    } catch (error) {
        console.error("Error while reading users:",error);
    }
};

const createUser = async(userData) => {
    try {
        console.log("createUser userData",userData)

        const parsedObject = JSON.parse(userData);
        // Check the type of userData
        if (typeof parsedObject !== 'object') throw new Error("Input data must be an object");

        const details = new userModel(parsedObject)
        // console.log("details",details);
        const createdUser = await details.save();
        // console.log("createdUser",createdUser)
        return createdUser;
    } catch (error) {
        console.error("Error while creating user:",error);
    }
}

const deleteUser = async({ userName }) => {
    try {
        const deletedUser = await userModel.deleteOne({ userName });
        // console.log("deletedUser",deletedUser);
        return deletedUser;
    } catch (error) {
        console.error("Error while deleting user:",error);
    }
}

const updateUser = async(userName,newData) => {
    try {
        console.log("userName",userName,"newData",newData)
        const usersData = await userModel.findOne({ userName }).exec();
  
        const parsedObject = JSON.parse(newData);
        // console.log("parsedObject",parsedObject)
        if (usersData && usersData.userName === userName){
            // console.log("Updating user")
            const updatedUser = await userModel.updateOne(usersData,parsedObject).exec();
            console.log("updatedUser",updatedUser)
            return updatedUser;
        } 
        console.log("user doesn't exist");
        const createdUser = await createUser(parsedObject);
        return createdUser;
    } catch (error) {
        console.error("Error while updating user:",error);
    }
}

module.exports = { 
    readUsers,
    createUser,
    deleteUser,
    updateUser
};