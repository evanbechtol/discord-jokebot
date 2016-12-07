let Discordie = require('discordie');
let _ = require('underscore');
const config = require('./config/');
const Events = Discordie.Events;
const client = new Discordie();

require('./client/')(client, Events, _);

try {
    client.connect({
        token: config.token
    });
} catch (e) {
    console.log(JSON.stringify(e));
}


