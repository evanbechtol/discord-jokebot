const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let guildObj = {
    gid: {
        type: String,
        index: true,
        unique: true
    },
    guildName: {
        type: String,
        index: true,
        unique: false
    },
    timesBotUsed: {
        type: Number
    }
};

let guildSchema = new Schema(guildObj);
let Guild = mongoose.model('Guild', guildSchema);
module.exports = Guild;