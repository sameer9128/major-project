const express=require("express");

const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const expressError=require("../utils/expressError")
const {listingSchema, reviewSchema}=require("../schema");

const Listing=require("../models/listing")
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController=require("../controllers/review")

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error);

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(',')
        throw new expressError(400,errMsg)
    }
    else{
        next();
    }
   
}

// review
// post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));
// delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;