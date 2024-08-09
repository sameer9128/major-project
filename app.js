if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express=require("express");
const mongoose=require("mongoose");
const Listing=require("./models/listing")
const app=express();
const path=require("path")
const methodOverride=require("method-override")
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate")
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
const wrapAsync=require("./utils/wrapAsync")
const expressError=require("./utils/expressError")
const {listingSchema, reviewSchema}=require("./schema");
const Review = require("./models/review");
const listings=require("./routes/listing")
const reviews=require("./routes/review")
const session=require("express-session")
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user")
const userRouter=require("./routes/user");
const { error } = require('console');
const mongoUrl=process.env.MONGODB_URL;
main().then(()=>{
    console.log("db connected")
})
.catch(err => console.log(err));

async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust1');
     await mongoose.connect(mongoUrl)
}

const store=MongoStore.create({
    mongoUrl:mongoUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("ERROR in mongo session store",err);
})
const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
// app.get('/demouser',async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     })
//     let registeredUser=await User.register(fakeUser,"helloworld")
//     res.send(registeredUser)
// })
app.use('/',userRouter);

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.all("/*",(req,res,next)=>{
    next(new expressError(404,"page not found"))
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message);
    // res.send("something went wrong")
})

app.listen(5000,(req,res)=>{
console.log("listening on port 5050")
 })

// app.get("/testlistings",async(req,res)=>{
//     const newListing=new Listing({
//         title:"my home",
//         description:"its beauty one",
//         price:1200,
//         location:"pune",
//         country:"india",
//     })
//     await newListing.save();
//     res.send("success")
//     console.log("new listing save")
// })