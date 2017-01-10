const CommandMethods = require('./command-methods');

module.exports = (Client, Events) => {
    /*
     Once the client is connected to the gateway, it will connect
     to the guilds that it has been assigned to.
     */
    Client.Dispatcher.on(Events.GATEWAY_READY, () => {
        console.log('Connected as: ' + Client.User.username);
        CommandMethods.gatewayReady(Client);
    });

    /*
     Keeps track of users entering any voice channel, on the guilds
     that the bot is connected to
     */
    Client.Dispatcher.on(Events.VOICE_CHANNEL_JOIN, (e) => {
        CommandMethods.voiceChannelJoin(Client, e);
    });

    /*
     Watches for the '!joke' command in all channels, in the guilds
     that the bot is connected to. Once the command is received, the
     bot retrieves a random joke line from the file, and returns it to
     the user that has been mentioned in the message.
     */
    Client.Dispatcher.on(Events.MESSAGE_CREATE, (e) => {
        CommandMethods.generateJoke(e);
    });
};
