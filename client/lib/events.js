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
     Watches for the '!jokebot' command in all guild text channels, in the guilds
     that the bot is connected to. Once the command is received, the
     bot parses the command, and returns the appropriate message for the command
     given (if any).
     */
    Client.Dispatcher.on(Events.MESSAGE_CREATE, (e) => {
        CommandMethods.parseCommands(Client, e);
    });

    /*
     When users being typing, event is called. A random number is then generated,
     if it is less 0.002, then a message is sent to the guild channel that the user
     is typing in.
     */
    Client.Dispatcher.on(Events.TYPING_START, (e) => {
        CommandMethods.typingStarted(Client, e);
    });
};
