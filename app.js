if (process.env.NODE_ENV != "production") {

    require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');


const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');




app.set('view enginee', "ejs");
app.set('views', path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));



// let dbUrl = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
})


async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", function (e) {
    console.log("Session Store Error", e);
});

// session options
const sessionOptions = {
    store,
    secret:  process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },
};



// app.get("/", (req, res) => {
//     res.send("Root ");
// });


//  session midleware
app.use(session(sessionOptions));
app.use(flash());

// passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//  success and error flash messages for listing and reviews
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // about curret user
    res.locals.currentUser = req.user;
    next();
})


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);





app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong !" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is running on port 8080");
});