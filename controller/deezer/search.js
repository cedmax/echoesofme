
module.exports = function( req, res ) {
	var request = require( 'request' );
	var cachedRequest = require( 'cached-request' )( request );
	var cacheDirectory = __dirname + '/../../tmp';
	cachedRequest.setCacheDirectory( cacheDirectory );
	var querystring = require( 'querystring' );
	var client = require( __dirname + '/../../settings.json' );

	var searchUrl = 'http://api.deezer.com/search?' +
			querystring.stringify( {
				q: 'artist:"' + req.query.artist + '" track:"' + req.query.track + '"',
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