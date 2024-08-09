const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","ypu must be login to create new listing");
        res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you don't have permission to edit")
        return res.redirect(`/listings/${id}`);
    }
    next();

};
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId)
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review")
        return res.redirect(`/listings/${id}`);
    }
    next();

};