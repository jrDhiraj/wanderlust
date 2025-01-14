const Listing = require("./models/listing");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;  // Store the requested URL
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");  // Redirect to login
    }
    next();  // Proceed to the next route or middleware
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log("This is the redirect url", req.session.redirectUrl);
    }
    next();
}




module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Find the listing and populate the 'owner' field
        const listing = await Listing.findById(id).populate('owner');

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listing");  // Prevent further code execution
        }
        if (!listing.owner) {
            req.flash("error", "Owner field is missing in the listing");
            return res.redirect(`/listing/${id}`);
        }

        // Ensure that the logged-in user is the owner of the listing
        if (!listing.owner._id.equals(res.locals.currentUser._id)) {
            req.flash("error", "You are not the owner of this listing");
            return res.redirect(`/listing/${id}`);  // Prevent further code execution
        }
        next();  // Proceed to the next middleware if the user is the owner
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong while checking ownership");
        return res.redirect("/listing");  // Prevent further code execution
    }
};

module.exports.isAuthor = async (req, res , next )=>{
    let {id , reviewid} = req. params ;
    let review = await Review.findById(reviewid);
    if(!review){
        req.flash("error", "Review not found");
        return res.redirect(`/listing/${id}`);
    }
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the auther of this review");
        return res.redirect(`/listing/${id}`);  // Prevent further code execution
    }

    next();
}