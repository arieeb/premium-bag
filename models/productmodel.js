const mongoose=require('mongoose');
const db=require('../config/mongooseconnection');
const productSchema=new mongoose.Schema({  
    image:String,
    name:String,
    price:Number,
    description:String,
    panelcolor:String,
    textcolor:String,
    bgcolor:String,
    rating:Number
});
const productModel=mongoose.model("products",productSchema);

module.exports=productModel;