module.exports = function( req, res ) {
	'use strict';

	var request = require( 'request' );
	var querystring = require( 'querystring' );
	var extractQs = require( 'url-querystring' );
	var config;

	function addToPlaylist( playlist, queue, callback ) {
		var set = queue.splice( 0, 30 );
		//set = set.reverse();

		var fillPlaylistOptions = config( {
			url: playlist + '?' + querystring.stringify( {
				songs: set.join( ',' )
			} )
		} );

		request.post( fillPlaylistOptions, function() {
			if ( queue.length ) {
				addToPlaylist( playlist, queue, callback );
			} else {
				callback();
			}
		} );
	}

	function createNewPlaylist( user, title, songs, res ) {
		var newPlayListOptions = config( {
			url: 'https://api.deezer.com/user/' + user + '/playlists?title=' + title
		} );

		request.post( newPlayListOptions, function( error, response, body ) {
			var playlistId = body && body.id;

			addToPlaylist( 'https://api.deezer.com/playlist/' + playlistId + '/tracklist', songs, function() {
				res.send( 'http://www.deezer.com/playlist/' + body.id );
				request = response = body = null;
			} );
		} );
	} 


	function addSongsToExistingPlaylist( playlist, songs, res ) {
		var existingPlaylistOptions = config( {
			url: playlist.tracklist + '?limit=1'
		} );

		request.get( existingPlaylistOptions, function( error, response, body ) {	
			var lastSong = body && body.data && body.data[0] && body.data[0].id;
			if ( lastSong ) {
				songs = songs.slice( songs.indexOf( lastSong ) + 1 );
			}

			if ( songs.length ) {
				addToPlaylist( playlist.tracklist, songs, function() {
					res.send( playlist.link );
					request = response = body = null;
				}, true );
			} else {
				res.send( playlist.link );
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
			url: url || 'http://api.deezer.com/user/' + user + '/playlists'
		} );

		request.get( getUserPlaylistsOptions, function( error, response, body ) {
			if ( body && body.data && body.data.length ) {
				var shazamPlaylist = body.data.filter( function( playlist ) {
					return playlist.title === title && playlist.creator.id === parseInt( user, 10 );
				} );

				if ( shazamPlaylist.length ) {
					cb( shazamPlaylist[0] );
				} else if ( body.next ) {
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
		var urlObj = extractQs( confObj.url );
		var hadQs = Object.keys( urlObj.qs ).length;
		urlObj.qs.access_token = urlObj.qs.access_token || req.query.at;
		confObj.url = urlObj.url + (( hadQs ) ? '&' : '?' ) + querystring.stringify( urlObj.qs );
		confObj.json = true;
		return confObj;
	};

	getUserPlaylists( req.query.user, title, function( playlist ) {
		addSongToPlaylist( playlist, req.query.user, title, songs, res );	
	} );
};