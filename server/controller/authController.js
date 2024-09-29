const logOutController = (req,res) => {
    try {
        req.logout((err) => {
            if (err) return next(err);
            req.session.destroy(()=>{
              res.clearCookie('connect.sid'); // Clear the session cookie
              res.clearCookie('user'); // Clear the session cookie
              res.redirect('http://localhost:5173/login');
            })
        });
    } catch (error) {
        console.error("Error while logging out:",error)   
    }
}

const sessionChecker = (req,res,next) => {
    try {
        console.log("auth",req.isAuthenticated())
        if (!req.isAuthenticated()) return res.json({message:"User is not authenticated",redirect:true, url:'/auth/google'});
      
        res.json({ message:"User is authenticated", redirect:false, user:req.user}); 
        // Display the user profile information
    } catch (error) {
        console.error("Error while Checking Session:",error)   
    }
}

const googleCallbackChecker = (req, res) => {
    try {
        const userName = req.user.displayName || req.user.name || 'User';

        const cookieOptions = {
          domain: 'localhost',
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: false, //  use true if you don't want F.E to read it
          sameSite: 'Lax', // use None for production 
          path:'/'
        }
        // Successful authentication, redirect to the frontend or dashboard
        res.cookie('user',userName,cookieOptions).
        redirect(`http://localhost:5173/`);
    } catch (error) {
        console.error("Error while running callback:",error)   
    }
}

module.exports = {
    sessionChecker,
    googleCallbackChecker,
    logOutController
}