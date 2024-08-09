const express=require("express");
const router=express.Router();

const wrapAsync = require("../utils/wrapAsync");
const expressError=require("../utils/expressError")
const {listingSchema, reviewSchema}=require("../schema");

const Listing=require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware");
const listingController=require("../controllers/listing")
const {storage}=require("../cloudConfig")
const multer  = require('multer')
const upload = multer({ storage })



const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(',')
        throw new expressError(400,errMsg)
    }
    else{
        next();
    }
   
}
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.postListing));

router.get("/new",isLoggedIn,listingController.newListing)
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
 
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));


module.exports=router;