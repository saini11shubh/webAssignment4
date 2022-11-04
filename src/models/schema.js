const mongoose = require("mongoose")
var validator = require('validator')

const UserSchema = new mongoose.Schema({
    user_OTP: {              
        mobile_no: {
            type: String,
            required:true
        },
        otp: {
            type: String,
            required:true
        },
        token: {
            type: String,
        },       
    },
    user_details: {
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            validate: (value) => {
              return validator.isEmail(value)
            }
        },
        phone_no: {
            type: Number,
        },
        password: {
            type: String,
            required: true,
        },
        signup_date: {         // print date in india standard time 
            type: String,
            default: Date
        },      
      
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
   
},{timestamps:true})

const SignupData=new mongoose.model('SignupData',UserSchema);
module.exports=SignupData;
