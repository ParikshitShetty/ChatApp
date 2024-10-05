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

const googleCallbackChecker = (req, res) => {
    try {
        const userName = req.user.displayName || req.user.name || 'User';

        console.log("userName callbackchecker",req.user)

        const cookieOptions = {
          domain: 'localhost',
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpOnly: false, //  use true if you don't want F.E to read it
          sameSite: 'Lax', // use None for production 
          path:'/'
        }
        // Successful authentication, redirect to the frontend or dashboard
        res.cookie('user',userName,cookieOptions).redirect(`http://localhost:5173/`);
    } catch (error) {
        console.error("Error while running callback:",error)   
    }
}

module.exports = {
    googleCallbackChecker,
    logOutController
}