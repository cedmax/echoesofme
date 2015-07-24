var google = require( 'googleapis' );
var youtube = google.youtube( 'v3' );

module.exports = function( req, res ) {
	var searchOptions = {
		q: req.query.q,
		part: 'snippet',
		maxResults: 1,
		type: 'video',
		videoCategoryId: 10,
		auth: global.client.apiKey
	};

	youtube.search.list( searchOptions, function( error, response ) {
		if ( !error && response ) {
			res.json( response );
		} else {
			res.status( 500 ).end();
		}
	} );
};