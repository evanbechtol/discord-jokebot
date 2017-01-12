let file_ops = require('./file-ops');
const _ = require('underscore');

module.exports = {
    gatewayReady: (Client) => {
        try {
            let guilds = Client.Guilds.toArray(),
                guild_names = [],
                now = new Date();

            for (let i = 0; i < guilds.length; i++) {
                guild_names.push(guilds[i].name);
            }

            let output = '[' + now + ']Connected to guilds: ' + JSON.stringify(guild_names);

            file_ops.writeToLog(output)
                .then(() => {
                    console.log(output);
                })
                .catch((e) => {
                    console.log(JSON.stringify(e));
                });

        } catch (e) {
            console.log(e);
        }
    },

    voiceChannelJoin: (Client, e) => {
        let data = {
                username: e.user.username,
                guild: Client.Guilds.get(e.guildId).name,
                channel: e.channel.name
            },
            now = new Date(),
            output = '[' + now + ']'
                + data.username + ' has entered channel '
                + data.channel + ' in guild ' + data.guild,
            guild = Client.Guilds.find(g => g.name === data.guild),
            channel = guild.generalChannel;

        // Special message for when Jeff joins the general channel
        if (data.username === 'Jeff' && data.channel === 'Booties for Breakfast') {

            file_ops.getRandomLine('joke')
                .then((joke) => {
                    let message = data.username + joke;

                    channel.sendMessage('Welcome back ' + message);
                })
                .catch((e) => {

                });
        }

        file_ops.writeToLog(output)
            .then(() => {
                console.log(output);
            })
            .catch((e) => {
                console.log(JSON.stringify(e));
            });
    },

    generateJoke: (e) => {
        let data = e.message.content.split(' ');

        if (_.first(data).toLowerCase() === '!joke') {

            if (e.message.mentions && e.message.mentions.length > 0) {

                let name = e.message.mentions[0].username,
                    now = new Date(),
                    message = "";
                file_ops.getRandomLine('joke')
                    .then((joke) => {
                        message = name + joke;
                        e.message.channel.sendMessage(message);
                    })
                    .then(() => {
                        let output = '[' + now + '] Sender: \"' + e.message.author.username + '\" Receiver: \"' + name + '\"';
                        return file_ops.writeToLog(output);
                    })
                    .then((result) => {
                        console.log(result);
                    })
                    .catch((e) => {
                        file_ops.writeToLog(e)
                            .then((result) => {
                                console.log('Error writing to file: ' + result);
                            });
                    });

            } else {
                e.message.channel.sendMessage('You must mention a user using @<username>');
            }
        }
    },

    typingStarted: (Client, e) => {
        let data = {
                username: e.user.username,
                mention: e.user.mention,
                guild: Client.Guilds.get(e.channel.guild_id).name,
                channel: e.channel.name
            },
            random = Math.random(),

            // Special get special probabilities
            specialUsers = ['Ferne', 'Jeff', 'Fluffy', 'Evan'];

        if (_.contains(specialUsers, data.username)) {
            random -= 0.3;
        }

        if (random < 0.08) {

            file_ops.getRandomLine('typing')
                .then((joke) => {
                    let message = data.mention + ', stop typing; ' + joke;
                    e.channel.sendMessage(message);
                })
                .catch((e) => {
                    file_ops.writeToLog(e)
                        .then((result) => {
                            console.log('Error writing to file: ' + result);
                        });
                });
        }
    }
};