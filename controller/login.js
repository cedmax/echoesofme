var querystring = require( 'querystring' );
var client = require( __dirname + '/../settings.json' );

function randomString( length ) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for ( var i = 0; i < length; i ++ ) {
		text += possible.charAt( Math.floor( Math.random() * possible.length ) );
	}
	return text;
}

module.exports = function( req, res ) {
	var stateKey = 'spotify_auth_state';
	var state = randomString( 16 );
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