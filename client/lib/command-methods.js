let file_ops = require('./file-ops');
const _ = require('underscore'),
    db = require(__dirname + '/../../db/');
/*
 Todo: add patch command to return most recent patch notes of game provided
 */


module.exports = {
    gatewayReady: (Client) => {

        /*
         Todo: Add DB feature to track guilds joined
         1) Pull all guilds that bot has already joined from the guild collection in the DB, store in array
         2) If Client.Guilds.toArray() returns a guild that is not present in the DB, add it to the DB
         */
        try {
            let guilds = Client.Guilds.toArray(),
                guild_names = [],
                now = new Date();

            for (let i = 0; i < guilds.length; i++) {
                guild_names.push(guilds[i].name);
            }

            db.models.Guild.find()
                console.log('here2');
                .then((data) => {
                console.log('here');
                    return _.filter(data, function (guild) {
                        console.log(guild);
                        return _.contains(guild_names, guild);
                    });
                })
                .then((missing_guilds) => {
                console.log(missing_guilds);
                    if (missing_guilds.length > 0) {
                        for (let i = 0; i < missing_guilds.length; i++) {
                            let obj = {
                                guildName: missing_guilds[i],
                                timesBotUsed: 0
                            };
                            console.log(obj);
                            db.models.Guild.save(function (err, obj) {
                                console.log('saved guilds: ' + obj);
                            })
                        }

                    }
                })
                .catch((e) => {
                    console.error('Error querying db: ' + e);
                });

            let output = '[' + now + '] Connected to guilds: ' + JSON.stringify(guild_names);

            file_ops.writeToLog(output)
                .then(() => {
                    console.log(output);
                })
                .catch((e) => {
                    console.error(JSON.stringify(e));
                });

        } catch (e) {
            console.log(e);
        }
    },

    generateHelp: (e) => {
        file_ops.readHelpFile()
            .then((message) => {
                e.message.channel.sendMessage(message);
            });
    },

    generateJoke: (e) => {
        if (e.message.mentions && e.message.mentions.length > 0) {
            let data = {
                    user: e.message.mentions[0],
                    channel: e.message.channel,
                    author: e.message.author
                },
                now = new Date(),
                message = "";

            file_ops.getRandomLine('joke')
                .then((joke) => {
                    message = data.user.mention + joke;
                    data.channel.sendMessage(message);
                })
                .then(() => {
                    let output = '[' + now + '] Sender: \"' + data.author.username + '\" Receiver: \"' + data.user.username + '\"';
                    return file_ops.writeToLog(output);
                })
                .then((result) => {
                    console.log(result);
                })
                .catch((e) => {
                    file_ops.writeToLog(e)
                        .then((result) => {
                            console.error('Joke error [' + now + ']: ' + result);
                        });
                });
        }
    },

    generateRebuttal: (e) => {
        let data = {
                user: e.message.mentions[0],
                channel: e.message.channel,
                author: e.message.author
            },
            now = new Date(),
            message = '';

        file_ops.getRandomLine('rebuttal')
            .then((joke) => {
                message = data.author.mention + joke;
                data.channel.sendMessage(message);
            })
            .catch((e) => {
                file_ops.writeToLog(e)
                    .then((result) => {

                        console.error('Rebuttal error [' + now + ']: ' + result);
                    });
            });
    },

    guildMemberAdd: (Client, e) => {
        let data = {
                username: e.user.username,
                mention: e.user.mention,
                guild: Client.Guilds.get(e.channel.guild_id).name
            },
            now = new Date(),
            guild = Client.Guilds.find(g => g.name === data.guild),
            channel = guild.generalChannel,
            message = '[' + now + ']' + data.username + ' joined ' + data.guild;

        channel.sendMessage(message);
        console.log(message);

    },

    guildCreate: (Client, e) => {
        let now = new Date(),
            output = '[' + now + '] JokeBot just joined guild: ' + e.guild.name;

        console.log(output);
    },

    parseCommands: function (Client, e) {
        let message = e.message.content.split(' '),
            first = _.first(message).toLowerCase(),
            len = message.length,
            author = e.message.author.username;

        if (author.toLowerCase() !== 'jokebot') {

            if (_.each(e.message.mentions, (item) => {
                    if (item.username === 'JokeBot') {
                        this.generateRebuttal(e);
                    }
                }))

                if (first === '!jokebot' && len > 1) {

                    switch (message[1].toLowerCase()) {
                        case 'help':
                            this.generateHelp(e);
                            break;

                        case 'joke':
                            this.generateJoke(e);
                            break;

                        default:
                            break;
                    }
                }
        }
    },

    typingStarted: (Client, e) => {
        let data = {
                username: e.user.username,
                mention: e.user.mention,
                guild: Client.Guilds.get(e.channel.guild_id).name,
                channel: e.channel
            },
            random = Math.random(),

            // Special users get special probabilities
            specialUsers = ['Ferne', 'Jeff', 'Fluffy', 'Evan'];

        if (_.contains(specialUsers, data.username)) {
            random -= 0.01;
        }

        if (random < 0.004) {

            file_ops.getRandomLine('typing')
                .then((joke) => {
                    let message = data.mention + ', stop typing; ' + joke;
                    data.channel.sendMessage(message);
                })
                .catch((e) => {
                    file_ops.writeToLog(e)
                        .then((result) => {
                            let now = new Date();
                            console.error('Typing error [' + now + ']: ' + result);
                        });
                });
        }
    },

    voiceChannelJoin: (Client, e) => {
        let data = {
                username: e.user.username,
                guild: Client.Guilds.get(e.guildId).name,
                channel: e.channel.name
            },
            guild = Client.Guilds.find(g => g.name === data.guild),
            channel = guild.generalChannel;

        // Special message for when user joins the general channel
        /*if (data.username === 'Jeff' && data.channel === 'Booties for Breakfast') {

         file_ops.getRandomLine('joke')
         .then((joke) => {
         let message = data.user.mention + joke;

         channel.sendMessage('Welcome back ' + message);
         })
         .catch((e) => {

         });
         }*/
    }
};