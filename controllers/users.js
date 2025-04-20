const User = require("../models/user")

module.exports.renderSignupForm = (req, res) => {
    res.render("../views/users/signup.ejs");
}


module.exports.signUp = async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // auto login after signUp
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })


    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}


module.exports.renderloginForm = (req, res) => {
    res.render("../views/users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirectUrl =  res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Now Logged out");
        res.redirect("/listings");
    });

}