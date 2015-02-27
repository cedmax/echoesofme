module.exports = function( req, res ) {
	'use strict';

	var domain = 'http://www.shazam.com';
	var cheerio = require( 'cheerio' );
	var request = require( 'request' );

	function list() {
		request( domain + '/charts', function( err, response, body ) {
			var $ = cheerio.load( body );

			var result = {};

			$( '.chrt-nav__select a' ).each( function( i, anchor ) {
				anchor = $( anchor );
				result[ anchor.text() ] = anchor.attr( 'href' );
			} );

			res.json( result );
		} );
	}

	function parse() {
		request( domain + uri, function( err, response, body ) {
			var $ = cheerio.load( body );
			var songs = [];
			$( '[itemtype="http://schema.org/MusicRecording"]' ).each( function( i, songItem ) {
				songs.push( {
					artist: $( songItem ).find( '[itemprop="byArtist"]' ).text().replace( 'by ', '' ).trim(),
					title: $( songItem ).find( 'h4' ).text()
				} );
			} );
			res.json( songs );
		} );
	}

	var uri = req && req.body && req.body.uri;

	if ( uri ) {
		parse( uri );
	} else {
		list();
	}

};