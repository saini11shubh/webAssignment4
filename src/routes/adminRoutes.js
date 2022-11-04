const express = require("express");
const adminRouter = express.Router();
const userRouter = express.Router();
const path = require("path")
const SignupData = require("../models/schema.js");
var validator = require('validator');
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

  if (!validateUsername(login_id)) {
    return res.status(400).json({ response: 'Invalid Username' });
  }

  if(!validatePassword(password)){
    return res.status(400).json({ response: 'Invalid password' });
  }

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


// Validates a username
function validateUsername(username) {
  return !validator.isEmpty(username) && validator.isAlphanumeric(username) && validator.isLength(username, { min: 6 });
}

//password validation call function
function validatePassword(password) {
  return !validator.isEmpty(password) && validator.isAlphanumeric(password) && validator.isLength(password, { min: 6 });
}
module.exports = adminRouter;