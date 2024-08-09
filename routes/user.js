const express=require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const router=express.Router();
const userController=require("../controllers/user")
router.route("/signup")
.get(userController.getSignup)
.post(wrapAsync(userController.signupUser));
router.route("/login")
.get(userController.getLogin)
.post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
  (userController.postLogin))

router.get("/logout",userController.getLogout)
module.exports=router;