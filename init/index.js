const mongoose=require("mongoose");
const express=require("express");
const initData=require("./data");
const Listing=require("../models/listing")

main().then(()=>{
    console.log("db connected")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust1');
}
const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"66b10f87d453170871f82167"}))
    await Listing.insertMany(initData.data);
    console.log("data was saved")
}
initDB();