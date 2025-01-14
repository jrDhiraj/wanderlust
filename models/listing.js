const mongoose = require('mongoose');
const { Schema } = mongoose;
const {Review} = require("./review.js");
const review = require('./review.js');

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url : String,
        filename: String,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    review:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

});


// ListingSchema.post("findOneAndDelete", async function (listing) {
//     if (listing) {
//         await Review.deleteMany({ _id: { $in: review} });

//        console.log('No listing found to delete reviews for');
//     }
// });


const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;
