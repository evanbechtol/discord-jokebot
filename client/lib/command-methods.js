let file_ops = require( './file-ops' );
const _      = require( 'underscore' );

module.exports = {
	gatewayReady : ( Client ) => {
		try {
			let guilds      = Client.Guilds.toArray(),
					guild_names = [],
					now         = new Date();
			
			for ( let i = 0; i < guilds.length; i++ ) {
				guild_names.push( guilds[ i ].name );
			}
			
			let output = '[' + now + ']Connected to guilds: ' + JSON.stringify( guild_names );
			
			file_ops.writeToLog( output )
					.then( () => {
						console.log( output );
					} )
					.catch( ( e ) => {
						console.log( JSON.stringify( e ) );
					} );
			
		} catch ( e ) {
			console.log( e );
		}
	},
	
	generateHelp : ( e ) => {
		file_ops.readHelpFile()
				.then( ( message ) => {
					e.message.channel.sendMessage( message );
				} );
	},
	
	generateJoke : ( e ) => {
		if ( e.message.mentions && e.message.mentions.length > 0 ) {
			let data    = {
						user    : e.message.mentions[ 0 ],
						channel : e.message.channel,
						author  : e.message.author
					},
					now     = new Date(),
					message = "";
			
			file_ops.getRandomLine( 'joke' )
					.then( ( joke ) => {
						message = data.user.mention + joke;
						data.channel.sendMessage( message );
					} )
					.then( () => {
						let output = '[' + now + '] Sender: \"' + data.author.username + '\" Receiver: \"' + data.user.username + '\"';
						return file_ops.writeToLog( output );
					} )
					.then( ( result ) => {
						console.log( result );
					} )
					.catch( ( e ) => {
						file_ops.writeToLog( e )
								.then( ( result ) => {
									console.log( 'Joke error: ' + result );
								} );
					} );
		}
	},
	
	generateRebuttal : ( e ) => {
		let data    = {
					user    : e.message.mentions[ 0 ],
					channel : e.message.channel,
					author  : e.message.author
				},
				message = '';
		
		file_ops.getRandomLine( 'rebuttal' )
				.then( ( joke ) => {
					message = data.author.mention + joke;
					data.channel.sendMessage( message );
				} )
				.catch( ( e ) => {
					file_ops.writeToLog( e )
							.then( ( result ) => {
								console.log( 'Rebuttal error: ' + result );
							} );
				} );
	},
	
	parseCommands : function ( Client, e ) {
		let message = e.message.content.split( ' ' ),
				first   = _.first( message ).toLowerCase(),
				len     = message.length,
				author  = e.message.author.username;
		
		if ( author.toLowerCase() !== 'jokebot' ) {
			
			if ( _.each( e.message.mentions, ( item ) => {
						if ( item.username === 'JokeBot' ) {
							this.generateRebuttal( e );
						}
					} ) ) {
				
				if (!e.message.mentions && e.message.content.indexOf( 'joke' ) > -1 ) {
					 let sendingMsg = 'Did somebody say joke?! I love jokes :smiley: ';
					 e.message.channel.sendMessage( sendingMsg );
				}
				
				if ( first === '!jokebot' && len > 1 ) {
					
					switch ( message[ 1 ].toLowerCase() ) {
						case 'help':
							this.generateHelp( e );
							break;
						
						case 'joke':
							this.generateJoke( e );
							break;
						
						default:
							break;
					}
				}
			}
		}
	},
	
	typingStarted : ( Client, e ) => {
		let data         = {
					username : e.user.username,
					mention  : e.user.mention,
					guild    : Client.Guilds.get( e.channel.guild_id ).name,
					channel  : e.channel
				},
				random       = Math.random(),
		
				// Special users get special probabilities
				specialUsers = [ 'Ferne', 'Jeff', 'Fluffy', 'Evan' ];
		
		if ( _.contains( specialUsers, data.username ) ) {
			random -= 0.01;
		}
		
		if ( random < 0.002 ) {
			
			file_ops.getRandomLine( 'typing' )
					.then( ( joke ) => {
						let message = data.mention + ', stop typing; ' + joke;
						data.channel.sendMessage( message );
					} )
					.catch( ( e ) => {
						file_ops.writeToLog( e )
								.then( ( result ) => {
									console.log( 'Typing error: ' + result );
								} );
					} );
		}
	},
	
	voiceChannelJoin : ( Client, e ) => {
		let data    = {
					username : e.user.username,
					guild    : Client.Guilds.get( e.guildId ).name,
					channel  : e.channel.name
				},
				guild   = Client.Guilds.find( g => g.name === data.guild ),
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
