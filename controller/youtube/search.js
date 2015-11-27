
module.exports = function( req, res ) {
	var client = require( __dirname + '/../../settings.json' );
	
	var google = require( 'googleapis' );
	var youtube = google.youtube( 'v3' );
	var OAuth2 = google.auth.OAuth2;
	var oauth2Client = new OAuth2( client.youtube.clientId, client.youtube.secret, client.youtube.redirectUri );
 	
	oauth2Client.setCredentials( {
		access_token: req.query.at
	} );

	var searchOptions = {
		q: req.query.q,
		part: 'snippet',
		maxResults: 1,
		type: 'video',
		videoCategoryId: 10,
		auth: oauth2Client
	};

	youtube.search.list( searchOptions, function( error, response ) {
		if ( !error && response ) {
			res.json( response );
		} else {
			res.status( 500 ).end();
		}
	} );
};