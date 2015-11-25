
module.exports = function( req, res ) {
	'use strict';

	var querystring = require( 'querystring' );
	var request = require( 'request' ); 
	var client = require( __dirname + '/../../settings.json' );
	
	var code = req.query.code || null;

	if ( code ) {
		var authOptions = {
			url: 'https://connect.deezer.com/oauth/access_token.php?' + 
			querystring.stringify( {
				app_id: client.deezer.appId,
				secret: client.deezer.secret,
				code: code,
			} ) 
		};

		request.get( authOptions, function( error, response, body ) {
			if ( !error && response.statusCode === 200 && body.indexOf( 'access_token' ) > -1 ) {
				var access_token = querystring.parse( body ).access_token;

				// we can also pass the token to the browser to make requests from there
				res.redirect( '/deezer.html#' +
					querystring.stringify( {
						access_token: access_token
					} ) );
			} else {
				res.redirect( '/deezer.html#' +
					querystring.stringify( {
						error: 'invalid_token'
					} ) );
			}
		} );
	}
};