var Eu = require( 'eu' );
var medea = require( 'medea' );
var MedeaStore = require( 'eu-medea-store' );

var db = medea();
var store = new MedeaStore( db );
var cache = new Eu.Cache( store, null, null, function() { return global.client.cache.songs;} );

var eu = new Eu( cache );
var querystring = require( 'querystring' );

module.exports = function( req, res ) {
	var searchUrl = 'https://api.spotify.com/v1/search?' +
			querystring.stringify( {
				q: req.query.q,
				type: 'track',
				market: req.query.market,
				limit: 1
			} );

	db.open( __dirname + '/../medea/songs', function() {
		eu.get( searchUrl, function( error, response, body ) {
			if ( !error && response.statusCode === 200 ) {
				res.json( JSON.parse( body ) );
			} else {
				res.status( 500 ).end();
			}
		} );
	} );
};