var domain = 'http://www.shazam.com';
var cheerio = require( 'cheerio' );
var async = require( 'async' );
var map = require( 'lodash.map' );
var client = require( '../settings.json' );
var Eu = require( 'eu' );
var medea = require( 'medea' );
var MedeaStore = require( 'eu-medea-store' );

var db = medea();
var store = new MedeaStore( db );
var cache = new Eu.Cache( store, null, null, function() { return client.cache.charts; } );

var eu = new Eu( cache );


var fetch = function( page, cb ) {
	db.open( __dirname + '/../medea/' + page.path.replace( /\//g, '' ), function() {
		eu.get( domain + page.path, function( err, response, body ) { 
			if ( err ) {
				cb( err );
			} else {

				cb( null, {
					page: page.name,
					data: body
				} );
			}
		} );
	} );
};

function list( res ) {
	db.open( __dirname + '/../medea/charts', function() {
		eu.get( domain + '/charts', function( err, response, body ) {
			var $ = cheerio.load( body );
			
			var returnObj = {};

			var array = map( $( '.chrt-header__links a' ), function( a ) { 
				return {
					name: $( a ).text(),
					path: $( a ).attr( 'href' )
				};
			} );

			async.map( array, fetch, function( err, results ) {
				if ( !err ) {
					results.forEach( function( result ) {
						var $ = cheerio.load( result.data );
						var obj = {};
						$( '.chrt-nav__select a' ).each( function( i, anchor ) {
							anchor = $( anchor );
							obj[ anchor.text() ] = anchor.attr( 'href' );
						} );
						returnObj[result.page] = obj;
					} );
				}
				res.json( returnObj );
			} );
		} );	
	} );
}

function parse( uri, res ) {
	db.open( __dirname + '/../medea/charts', function() {
		eu.get( domain + uri, function( err, response, body ) {
			var $ = cheerio.load( body );
			var songs = [];
			$( '[itemtype="http://schema.org/MusicRecording"]' ).each( function( i, songItem ) {
				songs.push( {
					artist: $( songItem ).find( '[itemprop="byArtist"]' ).text().replace( 'by ', '' ).trim(),
					title: $( songItem ).find( '[itemprop="name"]' ).text().trim()
				} );
			} );
			res.json( songs );
		} );	
	} );
}

module.exports = function( req, res ) {

	var uri = req && req.body && req.body.uri;

	if ( uri ) {
		parse( uri, res );
	} else {
		list( res );
	}

};