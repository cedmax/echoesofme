module.exports = function( client ) {
	'use strict';

	var request = require( 'request' );
	var querystring = require( 'querystring' );

	return function( req, res ) {

		var songs = req && req.body && req.body.songs;
		var title = req && req.body && req.body.title;

		if ( req.body.reverse ) {
			songs = songs.reverse();
		}

		var newPlayListOptions = {
			url: 'https://api.spotify.com/v1/users/' + req.query.user + '/playlists',
			body: {
				'name': title,
				'public': false
			},
			headers: {
				'Authorization': 'Bearer ' + req.query.at
			},
			json: true
		};

		function addToPlaylist( tracksUrl, queue, callback ) {
			var set = queue.splice( 0, 30 );

			var fillPlaylistOptions = {
				headers: {
					'Authorization': 'Bearer ' + req.query.at
				},
				json: true,
				url: tracksUrl + '?' + querystring.stringify( {
					uris: set.join( ',' )
				} )
			};

			request.post( fillPlaylistOptions, function() {
				if ( queue.length ) {
					addToPlaylist( tracksUrl, queue, callback );
				} else {
					callback();
				}

			} );
		}

		request.post( newPlayListOptions, function( error, response, body ) {

			var tracksUrl = body && body.tracks && body.tracks.href;

			addToPlaylist( tracksUrl, songs, function() {
				res.send( body.external_urls.spotify );
			} );
		} );
	};
};