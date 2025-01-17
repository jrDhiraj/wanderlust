const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utils/expressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const flash = require('connect-flash');
const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy;
const user = require('./models/user.js');
const router = express.Router({mergeParams: true});

// Import routes
const listingRuter = require("./routers/listing.js");
const reviewsRouter = require("./routers/reviews.js");
const userRouter = require("./routers/user.js");
// const atlsDB = process.env.myDataBase;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware configuration
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride('_method')); // Allow PUT/DELETE methods from forms
app.engine('ejs', engine); // Use ejs-mate engine for layouts
app.use(express.static(path.join(__dirname, '/public'))); // Serve static files
app.use(express.json()); // Parse JSON bodies


// Connect to MongoDB
const atlsDB = process.env.DATA_BASE
// const atlsDB = process.env.DATA_BASE;
main().then(() => {
    console.log("Connected to DB");
}).catch(err => console.log("This is error", err))
async function main() {
    await mongoose.connect(atlsDB)
}
const store = MongoStore.create({
    mongoUrl: atlsDB,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600 // time period in seconds
});

store.on("error", function(e){
    console.log("Session Store Error", e);
});
// Session and Flash Middleware setup (order is important)
const sessionOption = {
    // store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // 7 days
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true  // Secure cookie handling
    }
  };


// Use session and flash middleware
app.use(session(sessionOption)); 
app.use(flash());

// Passport session initialization
app.use(passport.initialize());
app.use(passport.session());

// Local Strategy without calling authenticate() here
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Expose flash messages to templates
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.message = req.flash('message');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;


    next();
});

// Use routes
app.use("/listing", listingRuter);
app.use("/listing/:id/review", reviewsRouter);
app.use("/", userRouter)

// Handle 404 errors
app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error-Handling Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Internal Server Error" } = err;
    res.status(statusCode).render('listings/error.ejs', { statusCode, message });
});
router.route("/listing")
    .get((req, res) => {
        res.render('listing');  // Replace with actual handler
    });
// Start the server
const port = 3000;
app.listen(port, () => {
    console.log("Server is running on port", port);
});
