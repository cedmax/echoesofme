
module.exports = function( req, res ) {
	'use strict';
	
	var querystring = require( 'querystring' );
	var client = require( __dirname + '/../../settings.json' );

	// your application requests authorization
	var perms = 'basic_access,manage_library';
	res.redirect( 'https://connect.deezer.com/oauth/auth.php?' +
		querystring.stringify( {
			app_id: client.deezer.appId,
			perms: perms,
			redirect_uri: client.deezer.redirectUri,
		} ) );
};