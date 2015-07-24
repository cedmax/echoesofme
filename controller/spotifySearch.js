
module.exports = function( req, res ) {
	var request = require( 'request' );
	var cachedRequest = require( 'cached-request' )( request );
	var cacheDirectory = __dirname + '/../tmp';
	cachedRequest.setCacheDirectory( cacheDirectory );
	var querystring = require( 'querystring' );
	var client = require( __dirname + '/../settings.json' );

	var searchUrl = 'https://api.spotify.com/v1/search?' +
			querystring.stringify( {
				q: req.query.q,
				type: 'track',
				market: req.query.market,
				limit: 1
			} );

	cachedRequest( {
		url: searchUrl,
		ttl: client.cache.songs
	}, function( error, response, body ) {
		if ( !error && response.statusCode === 200 ) {
			res.json( JSON.parse( body ) );
		} else {
			res.status( 500 ).end();
		}
		request = cachedRequest = querystring = client = response = body = null;
	} );
};