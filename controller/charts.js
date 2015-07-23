var domain = 'http://www.shazam.com';
var cheerio = require( 'cheerio' );
var async = require( 'async' );
var request = require( 'request' );
var cachedRequest = require('cached-request')(request);
cachedRequest.setCacheDirectory("./tmp");
var map = require('lodash.map');

var fetch = function(page, cb) {
	cachedRequest( {
		url: domain + page.path,
		ttl: 7200000
	}, function( err, response, body ) { 
		if ( err ) {
			cb(err);
		} else {

			cb(null, {
				page: page.name,
				data: body
			});
		}
	});
};

function list(res) {
	cachedRequest( {
		url: domain + '/charts',
		ttl: 7200000
	}, function( err, response, body ) {
		var $ = cheerio.load( body );
		
		var returnObj = {};

		var array = map( $( '.chrt-header__links a' ), function( a ) { 
			return {
				name: $(a).text(),
				path: $(a).attr('href')
			};
		} );

		async.map(array, fetch, function(err, results) {
			if ( !err ) {
				results.forEach(function(result) {
					var $ = cheerio.load( result.data );
					var obj = {};
					$( '.chrt-nav__select a' ).each( function( i, anchor ) {
						anchor = $( anchor );
						obj[ anchor.text() ] = anchor.attr( 'href' );
					} );
					returnObj[result.page] = obj;
				});
			}
			res.json( returnObj );
		});
	});
}

function parse(uri, res) {
	request( domain + uri, function( err, response, body ) {
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
}

module.exports = function( req, res ) {

	var uri = req && req.body && req.body.uri;

	if ( uri ) {
		parse( uri, res );
	} else {
		list( res );
	}

};