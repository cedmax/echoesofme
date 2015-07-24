module.exports = function( req, res ) {
	'use strict';

	var request = require( 'request' );
	var querystring = require( 'querystring' );
	var config;

	function addToPlaylist( tracksUrl, queue, callback ) {
		var set = queue.splice( 0, 30 );
		set = set.reverse();

		var fillPlaylistOptions = config( {
			url: tracksUrl + '?position=0&' + querystring.stringify( {
				uris: set.join( ',' )
			} )
		} );

		request.post( fillPlaylistOptions, function() {
			if ( queue.length ) {
				addToPlaylist( tracksUrl, queue, callback );
			} else {
				callback();
			}
		} );
	}

	function createNewPlaylist( user, title, songs, res ) {
		var newPlayListOptions = config( {
			url: 'https://api.spotify.com/v1/users/' + user + '/playlists',
			body: {
				'name': title,
				'public': false
			}
		} );

		request.post( newPlayListOptions, function( error, response, body ) {
			var tracksUrl = body && body.tracks && body.tracks.href;

			addToPlaylist( tracksUrl, songs, function() {
				res.send( body.external_urls.spotify );
				request = response = body = null;
			} );
		} );
	} 


	function addSongsToExistingPlaylist( shazamPlaylist, songs, res ) {
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
					request = response = body = null;
				}, true );
			} else {
				res.send( shazamPlaylist.external_urls.spotify );
				request = response = body = null;
			}
		} );
	}

	function addSongToPlaylist( playlist, user, title, songs, res ) {
		if ( playlist ) {
			addSongsToExistingPlaylist( playlist, songs, res );
		} else {
			createNewPlaylist( user, title, songs, res );
		}
	}

	function getUserPlaylists( user, title, cb, url ) {
		var getUserPlaylistsOptions = config( {
			url: url || 'https://api.spotify.com/v1/users/' + user + '/playlists'
		} );

		request.get( getUserPlaylistsOptions, function( error, response, body ) {
			if ( body && body.items && body.items.length ) {
				var shazamPlaylist = body.items.filter( function( playlist ) {
					return playlist.name === title && playlist.owner.id === user;
				} );

				if ( shazamPlaylist.length ) {
					cb(shazamPlaylist[0]);
				} else if ( response.body.next ) {
					getUserPlaylists( user, title, cb, response.body.next );
				} else {
					cb();
				}
			} else {
				cb();
			}
			response = body = null;
		} );
	}

	var songs = req && req.body && req.body.songs;
	var title = req && req.body && req.body.title;

	songs = songs.reverse();

	config = function( confObj ) {
		confObj.headers = {
			'Authorization': 'Bearer ' + req.query.at
		};
		confObj.json = true;
		return confObj;
	};

	getUserPlaylists( req.query.user, title, function(playlist){
		addSongToPlaylist(playlist, req.query.user, title, songs, res );	
	} );
};