const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js");
const { listingJoiSchema } = require('../schema.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js")

const multer  = require('multer')
const {storage}=require("../cloudconfig.js")
const upload = multer({ storage })


// index and create route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'), validateListing,  wrapAsync(listingController.createListing));
   
    

//  New Route 
router.get("/new", isLoggedIn, listingController.renderNewForm);


// Search Route
router.get("/search", async (req, res) => {
    const { query } = req.query;

    if (!query) {
        req.flash("error", "Please enter a search term.");
        return res.redirect("/listings");
    }

    try {
        // Search listings where the title, location, or country matches
        const listings = await Listing.find({
            $or: [
                { title: { $regex: query, $options: "i" } }, 
                { location: { $regex: query, $options: "i" } },
                { country: { $regex: query, $options: "i" } }
            ]
        });

        res.render("listings/search.ejs", { listings, query }); // Pass query for UI updates
    } catch (error) {
        console.error("Search Error:", error);
        req.flash("error", "Something went wrong with the search.");
        res.redirect("/listings");
    }
});



// show and update route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));




// edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;