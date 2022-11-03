const express = require("express");
const userRouter = express.Router();
const dotenv = require('dotenv')
dotenv.config();
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
var validator = require('validator');
const SECRET_KEY = 'ndkenskcnksnckndkcndnkcnekwn'
const SignupData = require("../models/schema.js");
const path = require('path')
// userRouter.get("/submit", async (req, res) => {
//     res.send("signup")
// });

var otp, emailphone;
userRouter.post("/signup", async (req, res) => {
    emailphone = req.body.emailphone;
    console.log("Email phone " + emailphone);
    try {
            const existingUser = await SignupData.find({"user_OTP.mobile_no":emailphone})
          
            // console.log(existingUser)
            debugger;
            console.log("isssssssssssssssss"+existingUser)
            if (existingUser) {
                return res.status(400).json({ message: "User already exist" })
            }
        //  const otp="123456"
        do {
            otp = Math.floor((Math.random() * 1000000) + 1);
            console.log(otp.toString().length);

        } while (otp < 6)



        console.log("Your Otp is " + otp)

        res.sendFile(path.join(__dirname, '../views/verify.html'))

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" })
    }

});

userRouter.post("/details", async (req, res) => {
    if (otp != req.body.otp) {
        res.status(200).send({ message: "please Enter valid otp " })
    }
    res.sendFile(path.join(__dirname, '../views/details.html'))

});


//user details and user_otp  save data on mongodb
userRouter.post("/details", async (req, res) => {
    if (otp != req.body.otp) {
        res.status(200).send({ message: "please Enter valid otp " })
    }
    res.sendFile(path.join(__dirname, '../views/details.html'))
});

userRouter.post('/register', async (req, res) => {
    if (!validator.isAlpha(req.body.first_name)) {
        return res.status(400).json({ response: 'Invalid first name' });
    }
    if (!validator.isAlpha(req.body.last_name)) {
        return res.status(400).json({ response: 'Invalid last name' });
    }
    if (!validateMobileno(req.body.phone_no)) {
        //throw new Error('Invalid mobile number!');
        return res.status(400).json({ response: 'Invalid mobile no' });
    }
    if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({ response: 'Invalid Email' });
    }
    if (!validator.isAlpha(req.body.state)) {
        return res.status(400).json({ response: 'Enter valid state' });
    }
    if (!validator.isAlpha(req.body.country)) {
        return res.status(400).json({ response: 'Enter valid country' });
    }
    if (!validator.isStrongPassword(req.body.password, { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        return res.status(400).json({ response: 'Invalid password' });
    }

    console.log("phone " + emailphone);
    console.log("OTP " + otp);
    let fname = req.body.first_name;
    let lname = req.body.last_name;
    let phone = req.body.phone_no;
    let email = req.body.email;
    // let address = req.body.city + " , " + req.body.state + " , " + req.body.country;
    let password = await bcrypt.hash(req.body.password, 10);
    console.log(password);
    // console.log(req.body);
    const newUser = await SignupData.create({
        user_OTP:
        {
            mobile_no: emailphone,
            otp: otp,
            token: "null"
        },
        user_details:
        {
            first_name: fname,
            last_name: lname,
            email: email,
            phone_no: phone,
            password: password,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country
        }
    })
    userid=newUser._id
    console.log(newUser._id);

    const token = jwt.sign({ id: newUser._id }, SECRET_KEY)
    const result = await newUser.save()

    await SignupData.findByIdAndUpdate(userid, { token: token },
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated User : ", docs);
            }
        });
    // const filter={user_OTP:{
    //     mobile_no:emailphone
    // }}
    // const update = {user_OTP:{
    //     token:token
    // }}

    // console.log(filter)

    // await SignupData.findby(filter, update);
    // SignupData.tokens=this.SignupData.tokens({token:token})


    //await SignupData.update(

    return res.json({ status: 201, message: 'user created', data: result, token: token })


});

// Validates a username
function validateUsername(username) {
    return !validator.isEmpty(username) && validator.isAlphanumeric(username) && validator.isLength(username, { min: 6, max: 32 });
}

//validates a mobile no
function validateMobileno(mobileno) {
    return !validator.isEmpty(mobileno) && validator.isMobilePhone(mobileno, 'any') && validator.isLength(mobileno, { min: 6, max: 14 });
}
module.exports = userRouter;