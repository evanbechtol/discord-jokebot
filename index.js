let Discordie = require('discordie'),
    _ = require('underscore');

const config = require('./config/'),
    Events = Discordie.Events,
    client = new Discordie({autoReconnect: true});

require('./client/')(client, Events, _);

/*
 Attempt to connect to the discord guilds that the bot
 is assigned to, or able to join.
 */
try {
    client.connect({
        token: config.token
    });
} catch (e) {
    console.log(JSON.stringify(e));
}