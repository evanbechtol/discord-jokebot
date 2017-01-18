let Discordie = require('discordie'),
    Events = Discordie.Events;

const
    config = require('../config/'),
    Client = new Discordie({autoReconnect: true}),
    db = require(__dirname + '/../db/');

/*
 Client index.js should only be responsible for connecting and maintaining connection

 Attempt to connect to the discord guilds that the bot
 is assigned to, or able to join.
 */
try {
    Client.connect({
        token: config.token
    });
    db.connect();
} catch (e) {
    console.error('Error:', e);
}

require('./lib/events')(Client, Events);

