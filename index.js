let Discordie = require('discordie');
const Events = Discordie.Events;
const client = new Discordie();
const config = require('./config/');


try {
    client.connect({
        token: config.token
    });
} catch (e) {
    console.log(JSON.stringify(e));
}

client.Dispatcher.on(Events.GATEWAY_READY, e => {
    console.log('Connected as: ' + client.User.username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e=> {
    if (e.message.content === 'PING') {
        e.message.channel.sendMessage('PONG');
    }
});