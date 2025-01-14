const Listing = require('../models/listing');
const Review = require('../models/review');
const User = require('../models/user');

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).send('Listing not found');
    }
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview._id);
    await newReview.save();
    await listing.save();
    res.redirect(`/listing/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    console.log(req.params)
    const { id, reviewid } = req.params;
    

    // Find the listing by its ID
    const listing = await Listing.findById(id);
    console.log(listing.review)
    // Remove the review from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewid } });

    // Delete the review from the Review model
    await Review.findByIdAndDelete(reviewid);
    console.log("Deleted review", reviewid)

    // Redirect to the listing page after the review is deleted
    res.redirect(`/listing/${listing._id}`);
}