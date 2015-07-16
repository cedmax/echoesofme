module.exports = function() {
	'use strict';

	var request = require( 'request' );
	var querystring = require( 'querystring' );

	return function( req, res ) {

		var songs = req && req.body && req.body.songs;
		var title = req && req.body && req.body.title;

		songs = songs.reverse();

		function config(confObj) {
			confObj.headers = {
				'Authorization': 'Bearer ' + req.query.at
			};
			confObj.json = true;
			return confObj;
		}


		function addToPlaylist( tracksUrl, queue, callback) {
			var set = queue.splice( 0, 3 );
			set = set.reverse();

			var fillPlaylistOptions = config( {
				url: tracksUrl + '?position=0&' + querystring.stringify( {
					uris: set.join( ',' )
				} )
			});

			request.post( fillPlaylistOptions, function() {
				if ( queue.length ) {
					addToPlaylist( tracksUrl, queue, callback );
				} else {
					callback();
				}
			} );
		}

		function createNewPlaylist() {
			var newPlayListOptions = config( {
				url: 'https://api.spotify.com/v1/users/' + req.query.user + '/playlists',
				body: {
					'name': title,
					'public': false
				}
			} );

			request.post( newPlayListOptions, function( error, response, body ) {
				var tracksUrl = body && body.tracks && body.tracks.href;

				addToPlaylist( tracksUrl, songs, function() {
					res.send( body.external_urls.spotify );
				} );
			} );
		} 

		function addSongsToExistingPlaylist(shazamPlaylist) {
			var existingPlaylistOptions = config( {
				url: shazamPlaylist.tracks.href + '?limit=1'
			} );

			request.get( existingPlaylistOptions, function( error, response, body ) {	
				var lastSong = body && body.items && body.items[0] && body.items[0].track.uri;
				if ( lastSong ) {
					songs = songs.slice( songs.indexOf( body.items[0].track.uri ) + 1 );
				}

				if ( songs.length ) {
					addToPlaylist( shazamPlaylist.tracks.href, songs, function() {
						res.send( shazamPlaylist.external_urls.spotify );
					}, true );
				} else {
					res.send( shazamPlaylist.external_urls.spotify );
				}
			} );
		}

		function getUserPlaylists( url ) {
			var getUserPlaylistsOptions = config( {
				url: url || 'https://api.spotify.com/v1/users/' + req.query.user + '/playlists'
			} );

			request.get( getUserPlaylistsOptions, function( error, response, body ) {
				if ( body && body.items && body.items.length ) {
					var shazamPlaylist = body.items.filter( function(playlist) {
						return playlist.name === title && playlist.owner.id === req.query.user;
					} );

					if ( shazamPlaylist.length ) {
						addSongsToExistingPlaylist( shazamPlaylist[0] );
					} else if ( response.body.next ) {
						getUserPlaylists(response.body.next );
					} else {
						createNewPlaylist();
					}
				} else {
					createNewPlaylist();
				}
			});
		}

		getUserPlaylists();
	};
};