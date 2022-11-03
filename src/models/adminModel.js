const mongoose = require("mongoose")
var validator = require('validator')

const UserSchema = new mongoose.Schema({
    login_id: {
        type: String,
    },
    password: {
        type: String,
    }
})

const adminData = new mongoose.model('adminData', UserSchema);
module.exports = adminData;