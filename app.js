
// Load environment variables
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// DNS configuration (workaround for your current DNS resolver issue)
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Imports
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");

// Routes
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const app = express();

// ==========================================
// VIEW ENGINE
// ==========================================

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ==========================================
// BASIC MIDDLEWARE
// ==========================================

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// SESSION CONFIGURATION
// ==========================================

const sessionOptions = {
    store: MongoStore.create({
        mongoUrl: process.env.ATLASDB_URL,
        crypto: {
            secret: process.env.SECRET
        },
        touchAfter: 24 * 3600
    }),

    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));

// ==========================================
// FLASH MESSAGES
// ==========================================

app.use(flash());

// ==========================================
// PASSPORT AUTHENTICATION
// ==========================================

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========================================
// LOCAL VARIABLES FOR EJS
// ==========================================

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user || null;

    next();
});

// ==========================================
// ROUTES
// ==========================================

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ==========================================
// 404 ERROR
// ==========================================

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
    const {
        statusCode = 500,
        message = "Something went wrong"
    } = err;

    res.status(statusCode).render("listings/error", {
        message
    });
});

// ==========================================
// DATABASE CONNECTION & SERVER
// ==========================================

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    if (!dbUrl) {
        throw new Error("ATLASDB_URL is missing in .env file");
    }

    if (!process.env.SECRET) {
        throw new Error("SECRET is missing in .env file");
    }

    await mongoose.connect(dbUrl);

    console.log("Connected to MongoDB Atlas");
}

main()
    .then(() => {
        app.listen(8080, () => {
            console.log("Server running on port 8080");
        });
    })
    .catch((err) => {
        console.error("Application startup error:", err);
        process.exit(1);
    });

module.exports = app;
