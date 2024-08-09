const User = require("../models/user");

module.exports.getSignup=(req,res)=>{
    res.render("user/signup.ejs")
}

module.exports.signupUser=(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to our airbnb")
        res.redirect("/listings");
    })
   

    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")

    }
})
module.exports.getLogin=(req,res)=>{
    res.render("user/login.ejs");
}
module.exports.postLogin=async(req,res)=>{
    req.flash("success","welcome back to our airbnb")
    // res.redirect("/listings")
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl)

}
module.exports.getLogout=(req,res,next)=>{
    req.logout((err)=>{
     if(err){
         return next(err);
     }
     req.flash("success","you are logout");
     res.redirect("/listings")
    })
    
 
 }