module.exports = (client, Events, _) => {
    client.Dispatcher.on(Events.GATEWAY_READY, () => {
        console.log('Connected as: ' + client.User.username);
    });

    client.Dispatcher.on(Events.MESSAGE_CREATE, (e) => {
        console.log('message received');
        let data = e.message.content.split(' ');

        if (_.first(data) === '!joke' && data.length > 1) {
            let name = e.message.mentions[0].username;
            let joke = name + ', if laughter is the best medicine, your face must be curing the world.';

            e.message.channel.sendMessage(joke);

        } else if (e.message.content === '!joke' && e.message.mentions.length === 0) {
            e.message.channel.sendMessage(('You must mention someone to make a joke about!'));
        }
    });
};