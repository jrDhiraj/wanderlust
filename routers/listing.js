if(process.env.NODE_ENV != 'production'){
  require('dotenv').config()

}

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const asyncWrap = require("../utils/wrapAsync.js")
const ExpressError = require('../utils/expressError');// Replace with the actual path to your ExpressError class
const { Review } = require("./reviews"); 
const { isLoggedIn,isOwner } = require('../loginMiddleware.js');
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")

const upload = multer({storage})


const listingControllers = require("../controllers/listing.js");
// const {listingSchema} = require("../schema.js")

const validateListing = (req, res, next) => {
    const { error } = req.body; // Assuming validation error comes from body
    if (error) {
      const errMsg = error.details.map(el => el.message).join(", ");
      return next(new ExpressError(400, errMsg));  // Changed to handle error properly
    } else {
      next();  // Proceed to the next middleware if no error
    }
  };

router.route("/")
.get(asyncWrap(listingControllers.index))
.post(isLoggedIn,upload.single("listing[image]"),
  validateListing,
  asyncWrap( listingControllers.postListing));



router.get("/new",
    isLoggedIn,
    listingControllers.renderNewForm
    ); 
// create route

router.route("/:id")
.get(asyncWrap(listingControllers.showListing))
.put(
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    asyncWrap(listingControllers.updateListing))
.delete(
    isOwner,
    isLoggedIn,
    validateListing, asyncWrap(listingControllers.deleteListing));


router.get("/:id/edit", 
    isOwner,
    isLoggedIn,
    asyncWrap(listingControllers.renderEditform));
    
 // update route  



module.exports = router;

