let fs = require('fs');
const Promise = require('es6-promise').Promise;

module.exports = (client, Events, _) => {
    /*
     Once the client is connected to the gateway, it will connect
     to the guilds that it has been assigned to.
     */
    client.Dispatcher.on(Events.GATEWAY_READY, () => {
        console.log('Connected as: ' + client.User.username);
        try {
            let guilds = client.Guilds.toArray(),
                guild_names = [],
                now = new Date();

            for (let i = 0; i < guilds.length; i++) {
                guild_names.push(guilds[i].name);
            }

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

    /*
     Keeps track of users entering any voice channel, on the guilds
     that the bot is connected to
     */
    client.Dispatcher.on(Events.VOICE_CHANNEL_JOIN, (e) => {
        data = {
            username: e.user.username,
            channel: e.channel.name,
            guild: client.Guilds.get(e.guildId).name
        };
        let now = new Date(),
            output = '[' + now + ']'
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

    /*
     Watches for the '!joke' command in all channels, in the guilds
     that the bot is connected to. Once the command is received, the
     bot retrieves a random joke line from the file, and returns it to
     the user that has been mentioned in the message.
     */
    client.Dispatcher.on(Events.MESSAGE_CREATE, (e) => {
        //console.log(e.message);
        generateJoke(e);
    });

    /*
     Helper method to retrieve random lines from the joke file
     */
    function getRandomLine() {
        let filename = 'jokes.txt',
            path = __dirname + '/data/',
            filepath = path + filename;

        return new Promise((resolve, reject) => {
            fs.readFile(filepath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    let string = data.toString(),
                        lines = string.split('\n');

                    resolve(lines[Math.floor(Math.random() * lines.length)]);
                }
            });
        });
    }

    /*
     Generates the joke and message. Checks to ensure proper message
     format is given.
     */
    function generateJoke(e) {
        let data = e.message.content.split(' ');
        if (_.first(data) === '!joke') {
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
                        return writeToLog(output);
                    })
                    .then((result) => {
                        console.log(result);
                    })
                    .catch((e) => {
                        writeToLog(e)
                            .then((result) => {
                                console.log('Error writing to file: ' + result);
                            });
                    });
            } else {
                e.message.channel.sendMessage('You must mention a user using @<username>');
            }
        }
    }

    /*
     Writes all events to log for later review
     */
    function writeToLog(data) {
        return new Promise((resolve, reject) => {
            let path = __dirname + '/log.txt';
            fs.appendFile(path, data + '\r\n', (err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(data);
                }
            });
        });
    }
};