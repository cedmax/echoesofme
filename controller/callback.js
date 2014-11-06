module.exports = function( client ) {
	'use strict';

	var querystring = require( 'querystring' );
	var request = require( 'request' ); // "Request" library

	return function( req, res ) {

		var code = req.query.code || null;
		var state = req.query.state || null;
		var storedState = req.cookies ? req.cookies[ 'spotify_auth_state' ] : null;

		if ( state === null || state !== storedState ) {
			res.redirect( '/#' +
				querystring.stringify( {
					error: 'state_mismatch'
				} ) );
		} else {
			res.clearCookie( 'spotify_auth_state' );
			var authOptions = {
				url: 'https://accounts.spotify.com/api/token',
				form: {
					code: code,
					redirect_uri: client.redirectUri,
					grant_type: 'authorization_code'
				},
				headers: {
					'Authorization': 'Basic ' + ( new Buffer( client.appId + ':' + client.secret ).toString( 'base64' ) )
				},
				json: true
			};

			request.post( authOptions, function( error, response, body ) {
				if ( !error && response.statusCode === 200 ) {

					var access_token = body.access_token,
						refresh_token = body.refresh_token;

					/*var options = {
						url: 'https://api.spotify.com/v1/me',
						headers: {
							'Authorization': 'Bearer ' + access_token
						},
						json: true
					};

					// use the access token to access the Spotify Web API
					request.get( options, function( error, response, body ) {
						console.log( body );
					} );
*/
					// we can also pass the token to the browser to make requests from there
					res.redirect( '/#' +
						querystring.stringify( {
							access_token: access_token,
							refresh_token: refresh_token
						} ) );
				} else {
					res.redirect( '/#' +
						querystring.stringify( {
							error: 'invalid_token'
						} ) );
				}
			} );
		}
	};
};