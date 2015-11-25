
module.exports = function( req, res ) {
	'use strict';
	
	var randomstring = require( "randomstring" );
	var querystring = require( 'querystring' );
	var client = require( __dirname + '/../../settings.json' );

	var stateKey = 'spotify_auth_state';
	var state = randomstring.generate( 16 );
	res.cookie( stateKey, state );

	// your application requests authorization
	var scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public';
	res.redirect( 'https://accounts.spotify.com/authorize?' +
		querystring.stringify( {
			response_type: 'code',
			client_id: client.spotify.appId,
			scope: scope,
			redirect_uri: client.spotify.redirectUri,
			state: state
		} ) );
};