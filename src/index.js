const express = require("express");
const app = express();
const port = 3000;
const mongoose=require("mongoose");
const path=require("path");
const bodyParser = require('body-parser')
const userRouter=require("./routes/userRoutes")
const adminRouter=require("./routes/adminRoutes")
app.use(express.json());  // recognize the incoming Request object as a JSON object
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/",userRouter);
app.use("/",adminRouter);

const dbo= 'mongodb+srv://root:root@cluster0.anxpl4q.mongodb.net/TestData?retryWrites=true&w=majority'
mongoose.connect(dbo).then(()=>{
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
}).catch((e)=>{
    console.log("Database connection Error")
})

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'./views/signup.html'))
})

