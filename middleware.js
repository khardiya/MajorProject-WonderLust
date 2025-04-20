const Listing= require("./models/listing");
const { listingJoiSchema} = require('./schema.js');
const {  reviewSchema } = require('./schema.js');
const ExpressError = require("./utils/ExpressError.js");
const Review= require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // when user try to resquest any path we want to store that path
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be Login  first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res ,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// middleware for check that current user owned that listing
module.exports.isOwner= async (req,res,next)=>{
    const { id } = req.params;
    let listing =  await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the Owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

// validate listing
module.exports.validateListing = (req, res, next) => {
    // console.log("Received body in middleware:", req.body); // ✅ Debugging step
    // console.log("Is listingJoiSchema defined?", listingJoiSchema !== undefined);// ✅ Check if listingJoiSchema is defined
    let { error } = listingJoiSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }

}


// validate reviews
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }

}


//  middelware for review author check
module.exports.isReviewAuthor= async (req,res,next)=>{
    const {id, reviewId } = req.params;
    let review =  await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the Author of this Review ");
        return res.redirect(`/listings/${id}`)
    }
    next();
}