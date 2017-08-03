const express   = require( 'express' );
let app         = express(),
			Discordie = require( 'discordie' ),
			Events    = Discordie.Events;

const
		config = require( '../config/' ),
		Client = new Discordie( { autoReconnect : true } );

/*
 Client index.js should only be responsible for connecting and maintaining connection

 Attempt to connect to the discord guilds that the bot
 is assigned to, or able to join.
 */
try {
	app.listen( config.port, () => {
		Client.connect( {
			token : config.token
		} );
	} );
	
} catch ( e ) {
	console.log( JSON.stringify( e ) );
}

require( './lib/events' )( Client, Events );

