module.exports = function( req, res ) {
	'use strict';

	var config;
	var client = require( __dirname + '/../../settings.json' );
	var google = require( 'googleapis' );
	var OAuth2 = google.auth.OAuth2;
	var oauth2Client = new OAuth2( client.youtube.clientId, client.youtube.secret, client.youtube.redirectUri );
 	
	oauth2Client.setCredentials( {
		access_token: req.query.at
	} );
 	 
	var youtube = google.youtube( 'v3' );

	function findLastSongAdded( playlistId, callback ) {
		var existingPlaylistOptions = config( {
			part:'snippet',
			playlistId: playlistId,
			maxResults: 1
		} );

		youtube.playlistItems.list( existingPlaylistOptions, function( error, body ) {
			var lastSong = body && body.items && body.items[0] && body.items[0].snippet.resourceId.videoId;
			callback( lastSong );
		} );
	}



	function getUserPlaylists( title, cb, pageToken ) {
		var confObj = config( {
			part: 'snippet',
			mine: true
		} )
		if ( pageToken ) {
			confObj.pageToken = pageToken
		}

		youtube.playlists.list( confObj, function( err, body ) {
			if ( body && body.items && body.items.length ) {
				var shazamPlaylist = body.items.filter( function( playlist ) {
					return playlist.snippet.title === title;
				} );

				if ( shazamPlaylist.length ) {
					cb( shazamPlaylist[0].id );
				} else if ( body.nextPageToken ) {
					getUserPlaylists( title, cb, body.nextPageToken );
				} else {
					cb();
				}
			} else {
				cb();
			}
		} );
	}

	config = function( confObj ) {
		confObj.auth = oauth2Client
		return confObj;
	};

	getUserPlaylists( req.query.title, function( playlistId ) {
		findLastSongAdded( playlistId, function( lastSong ) {
			res.json( {
				lastSong: lastSong,
				playlistId: playlistId
			} );
		} );
	} );
};