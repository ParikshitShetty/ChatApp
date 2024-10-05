const sessionChecker = (req,res,next) => {
    try {
        console.log("authenticated",req.isAuthenticated(),"sessionChecker cookie:",req)
        if (!req.isAuthenticated()) return res.status(401).json({ message:"User is not authenticated", redirect:true}); 
        console.log("authenticated")
        next()
    } catch (error) {
        console.error("Error while Checking Session:",error)   
    }
}

module.exports = {
    sessionChecker
}