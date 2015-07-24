var request = require( 'request' ); // "Request" library
var client = require( '../settings.json' );

module.exports = function( req, res ) {

	var refresh_token = req.query.refresh_token;
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: {
			'Authorization': 'Basic ' + ( new Buffer( client.spotify.appId + ':' + client.spotify.secret ).toString( 'base64' ) )
		},
		form: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		},
		json: true
	};

	request.post( authOptions, function( error, response, body ) {
		if ( !error && response.statusCode === 200 ) {
			var access_token = body.access_token;
			res.send( {
				'access_token': access_token
			} );
		} else {
			res.status( 500 ).end();
		}
	} );
};