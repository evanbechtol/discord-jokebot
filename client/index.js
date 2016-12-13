let fs = require('fs');
const Promise = require('es6-promise').Promise;

module.exports = (client, Events, _) => {
    client.Dispatcher.on(Events.GATEWAY_READY, () => {
        console.log('Connected as: ' + client.User.username);
        try {
            let guilds = client.Guilds.toArray();
            let guild_names = [];
            for (let i = 0; i < guilds.length; i++) {
                guild_names.push(guilds[i].name);
            }
            let now = new Date();
            let output = '[' + now + '] Connected to guilds: ' + JSON.stringify(guild_names);
            writeToLog(output)
                .then(() => {
                    console.log(output);
                })
                .catch((e) => {
                    console.log(JSON.stringify(e));
                });
        } catch (e) {
            console.log(e);
        }

    });

    client.Dispatcher.on(Events.VOICE_CHANNEL_JOIN, (e) => {
        data = {
            username: e.user.username,
            channel: e.channel.name,
            guild: client.Guilds.get(e.guildId).name
        };
        let now = new Date();
        let output = '[' + now + ']'
            + data.username + ' has entered channel '
            + data.channel + ' in guild ' + data.guild;

        writeToLog(output)
            .then(() => {
                console.log(output);
            })
            .catch((e) => {
                console.log(JSON.stringify(e));
            });
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
                            let output = '[' + now + '] Sender: \"' + e.message.author.username + '\" Receiver: \"' + name + '\"';
                            writeToLog(output)
                                .then(() => {
                                    console.log(output);
                                });
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

    function writeToLog(data) {
        return new Promise((resolve, reject) => {
            let path = __dirname + '/log.txt';
            fs.appendFile(path, data + '\r\n', {flags: 'a+'}, (err, data) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(data);
                }
            });
        });
    }
};