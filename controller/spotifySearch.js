var querystring = require( 'querystring' );
var request = require( 'request' );
var cachedRequest = require('cached-request')(request);
cachedRequest.setCacheDirectory("./tmp");

module.exports = function(req, res ) {
	var searchOptions = {
		url: 'https://api.spotify.com/v1/search?' +
			querystring.stringify( {
				q: req.query.q,
				type: 'track',
				market: req.query.market,
				limit: 1
			} ),
		ttl: global.client.cache.songs
	};

	cachedRequest.get( searchOptions, function( error, response, body ) {
		if ( !error && response.statusCode === 200 ) {
			res.json( JSON.parse( body ) );
		} else {
			res.status(500).end();
		}
	} );
};