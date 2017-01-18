const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let userObj = {
    uid: {
        type: String,
        index: true,
        unique: true
    },
    username: {
        type: String,
        index: true,
        unique: false
    },
    lastLogin: {
        type: Date
    },
    timesMentioned: {
        type: Number
    },
    timesBotUsed: {
        type: Number
    }
};

let userSchema = new Schema(userObj);
let User = mongoose.model('User', userSchema);
module.exports = User;