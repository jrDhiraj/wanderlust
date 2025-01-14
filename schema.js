const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(), // Use Joi with uppercase J
        description: Joi.string().required(),
        price: Joi.number().required().min(500), // price should be a number
        image: Joi.string().allow("", null),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(), default : "very good",
    })
})