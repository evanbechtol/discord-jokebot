const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let responseObj = {
    type: {
        type: String
    },
    response: {
        type: String,
        index: true,
        unique: true
    }
};

let responseSchema = new Schema(responseObj);
let Response = mongoose.model('Response', responseSchema);
module.exports = Response;