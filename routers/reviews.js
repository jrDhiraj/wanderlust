const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/review.js")
const {reviewSchema} = require("../schema.js");
const { isLoggedIn } = require("../loginMiddleware.js");

const {isAuthor}  = require ("../loginMiddleware.js")

const reviewControllers = require("../controllers/review.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        return res.status(400).send({ error: errMsg });
    } else {
        next();
    }
};

router.post("/", 
    isLoggedIn,
    validateReview,
    wrapAsync(reviewControllers.createReview)
);

router.delete("/:reviewid", 
    isLoggedIn,
    isAuthor,
    wrapAsync(reviewControllers.deleteReview)
);


module.exports = router;