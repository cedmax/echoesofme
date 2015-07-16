/*global gapi, progressBar: true */

function createPlaylist( songs, title, config ) {
	'use strict';

	gapi.client.load( 'youtube', 'v3', function() {
		function fillPlaylist( playlistId, queue ) {
			var song = queue.shift();
			progressBar.update();

			if ( song ) {
				var request = gapi.client.youtube.playlistItems.insert( {
					part: 'snippet',
					resource: {
						snippet: {
							playlistId: playlistId,
							resourceId: {
								videoId: song,
								kind: 'youtube#video'
							}
						}
					}
				} );
				request.execute( function() {
					fillPlaylist( playlistId, queue );
				} );
			} else {
				progressBar.finish();
				config.success( playlistId );
			}
		}

		var request = gapi.client.youtube.playlists.insert( {
			part: 'snippet,status',
			resource: {
				snippet: {
					title: title
				},
				status: {
					privacyStatus: 'private'
				}
			}
		} );
		request.execute( function( response ) {
			var result = response.result;

			if ( result ) {
				var playlistId = result.id;
				progressBar = progressBar( songs.length );
				fillPlaylist( playlistId, songs );
			}
		} );
	} );
}