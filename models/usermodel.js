const mongoose=require('mongoose');
const db=require('../config/mongooseconnection');

const userSchema=new mongoose.Schema({  
    fullname:{type:String,required:true},
    email:String,
    password:String,
    confirmpassword:String,
    cart: {
        type:Array,
        default:[]
    },
    isadmin:Boolean,
    orders:{
        type:Array,
        default:[]
    },
    contact:Number,
    picture:String
});
const userModel=mongoose.model("users",userSchema);

module.exports=userModel;