const express = require("express");
const adminRouter = express.Router();
const userRouter = express.Router();
const path = require("path")
const SignupData = require("../models/schema.js");

const ejs = require('ejs');
//adminRouter.set('view engine', 'ejs');
const adminData = require("../models/adminModel.js");

adminRouter.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, '../template/adminlogin.html'))
})
adminRouter.post("/admin", async (req, res) => {

    const { login_id, password } = req.body;

    console.log(login_id);
    console.log(password);

    const existingUser = await adminData.findOne({ login_id: login_id, password: password })
    console.log(existingUser);
    if (existingUser != null) {
        console.log("its working")
       //res.status(200).send({ message: "Successfully Enter" })
         SignupData.find({}, (err, result) => {
            if (err) throw err;           
            res.render('index', {
              dataList: result
            })
            console.log(result)
          })
    }
    else {
        res.status(400).send({ message: "please Enter valid id and password" })
    }
})
module.exports = adminRouter;