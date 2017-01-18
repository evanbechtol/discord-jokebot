const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    config = require(__dirname + '/../config/'),
    models = require(__dirname + '/models/');

let db = mongoose.connection;

function connect() {
    db.on('error', console.error);
    db.once('open', function () {

    });

    try {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.dbUri + 'jokeBot');
        console.log('Connected to JokeBot DB');
    } catch (e) {
        console.error('Error: ', e);
    }
}

module.exports = {
    connect: connect,
    models: models
};


