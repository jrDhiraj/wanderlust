const User = require("../models/user");
const passport = require("passport");

module.exports.renderSignupPage = (req, res) => {
    res.render("./users/signup.ejs")
}

module.exports.createUser =  async (req, res) => {
            try {
                let { username, email, password} = req.body
                // Basic validation

                const newUser = new User({ email, username });
                const registerUser = await User.register(newUser, password);
                req.login(registerUser, (err) => {
                    if (err){ 
                        return next(err);
                    }
                     req.flash("success", "welcome to wanderlust")
                // console.log(registerUser)
                    res.redirect("/listing")
                })
               
            } catch (error) {
                req.flash("error", error.message)
                res.redirect("/signup")
            }
}

module.exports.renderLoginPage =  (req, res) => {
    res.render("./users/login.ejs")
}

module.exports.postLogin = async (req, res) => {
    req.flash("success", "Welcome to WanderLust");
    console.log("This is the redirect url", req.session.redirectUrl);
    const redirectUrl = res.locals.redirectUrl || '/listing';  // Default to '/listing' if no redirectUrl
    res.redirect(redirectUrl);  // Redirect to the stored or default URL
};


module.exports.userLogout =  (req, res) => {
    req.logout((err)=>{
        if(err) {
           return next(err);
        }
    });
    res.redirect("/listing")
}