let fs = require('fs');
const Promise = require('es6-promise').Promise;

module.exports = (client, Events, _) => {
    client.Dispatcher.on(Events.GATEWAY_READY, () => {
        console.log('Connected as: ' + client.User.username);
    });

    client.Dispatcher.on(Events.MESSAGE_CREATE, (e) => {
        //console.log(e.message);
        generateJoke(e);
    });

    function getRandomLine() {
        let filename = 'jokes.txt';
        let path = __dirname + '/data/';
        let filepath = path + filename;

        return new Promise((resolve, reject) => {
            fs.readFile(filepath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    let string = data.toString();
                    let lines = string.split('\n');

                    resolve(lines[Math.floor(Math.random() * lines.length)]);
                }
            });
        });
    }

    function generateJoke(e) {
        let data = e.message.content.split(' ');
        try {
            if (_.first(data) === '!joke' && data.length > 1) {
                if (e.message.mentions && e.message.mentions.length > 0) {
                    let name = e.message.mentions[0].username,
                        now = new Date(),
                        message = "";

                    getRandomLine()
                        .then((joke) => {
                            message = name + joke;
                            e.message.channel.sendMessage(message);
                        })
                        .then(() => {
                            console.log('[' + now + '] Sender: \"' + e.message.author.username + '\" Receiver: \"' + name + '\"');
                        });
                } else {
                    throw(mentionError);

                }
            } else if (e.message.content === '!joke' && e.message.mentions.length === 0) {
                throw(mentionError);
            }
        } catch (mentionError) {
            e.message.channel.sendMessage('You must mention a user using @<username>');
        }
    }
};