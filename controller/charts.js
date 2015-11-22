module.exports = function( req, res ) {
	'use strict';
	
	var domain = 'http://www.shazam.com';
	var cheerio = require( 'cheerio' );
	var async = require( 'async' );
	var map = require( 'lodash.map' );
	var request = require( 'request' );
	var cachedRequest = require( 'cached-request' )( request );
	var cacheDirectory = __dirname + '/../tmp';
	cachedRequest.setCacheDirectory( cacheDirectory );

	var client = require( __dirname + '/../settings.json' );

	var fetch = function( page, cb ) {
		var url = domain + page.path;
		cachedRequest( {
			url: url, 
			ttl: client.cache.charts
		}, function( err, response, body ) { 
			if ( err ) {
				cb( err );
			} else {
				cb( null, {
					url: url,
					page: page.name,
					data: body
				} );
			}
		} );
	};

	function list( res ) {
		cachedRequest( {
			url: domain + '/charts',
			ttl: client.cache.charts
		}, function( err, response, body ) {
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
						returnObj[result.page] = {
							url: result.url,
							data: obj
						};
					} );
				}
				res.json( returnObj );
				request = cachedRequest = client = response = body = $ = null;
			} );
		} );	
	}

	function parse( uri, res ) {
		cachedRequest( {
			url: domain + uri,
			ttl: client.cache.charts
		}, function( err, response, body ) {
			var $ = cheerio.load( body );
			var songs = [];
			$( '[itemtype="http://schema.org/MusicRecording"]' ).each( function( i, songItem ) {
				songs.push( {
					artist: $( songItem ).find( '[itemprop="byArtist"]' ).text().replace( 'by ', '' ).trim(),
					title: $( songItem ).find( '[itemprop="name"]' ).text().trim()
				} );
			} );
			res.json( songs );
			request = cachedRequest = client = response = body = $ = null;
		} );	
	}

	var uri = req && req.body && req.body.uri;

	if ( uri ) {
		parse( uri, res );
	} else {
		list( res );
	}

};