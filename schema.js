const Joi = require("joi");
const Listing = require("./models/listing");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      filename: Joi.string().optional().allow(null, ''),
      url: Joi.string().uri().required().allow("", null),
    })
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),

  }).required()
})


module.exports = { listingSchema, reviewSchema };