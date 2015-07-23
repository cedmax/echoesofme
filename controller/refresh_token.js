var request = require( 'request' ); // "Request" library

module.exports = function(req, res) {

	var refresh_token = req.query.refresh_token;
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: {
			'Authorization': 'Basic ' + ( new Buffer( global.client.spotify.appId + ':' + global.client.spotify.secret ).toString( 'base64' ) )
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
			res.status(500).end();
		}
	} );
};