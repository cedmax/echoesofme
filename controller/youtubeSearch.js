module.exports = function() {
	'use strict';

	var google = require( 'googleapis' );
	var youtube = google.youtube( 'v3' );
	var client = require( '../settings' ).youtube;

	return function( req, res ) {

		var searchOptions = {
			q: req.query.q,
			part: 'snippet',
			maxResults: 1,
			type: 'video',
			videoCategoryId: 10,
			auth: client.apiKey
		};

		youtube.search.list( searchOptions, function( error, response ) {
			if ( !error && response ) {
				res.json( response );
			}
		} );

	};
};