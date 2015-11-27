/*global getHashParams, global gapi, progressBar: true */

function createPlaylist( songs, title, config ) {
	'use strict';

	var params = getHashParams();

	$.ajax( {
		url: '/youtube/playlist?at=' + params.access_token + '&title=' + title,
		contentType: 'application/json',
		success: function( data ) {
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
								},
								position:0
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

				if ( !data.playlistId ) {
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
						console.log(result)
						if ( result ) {
							var playlistId = result.id;
							progressBar = progressBar( songs.length );
							fillPlaylist( playlistId, songs );
						}
					} );
				} else {
					if ( data.lastSong ) {
						songs = songs.slice( songs.indexOf( data.lastSong ) + 1 );
					}
					progressBar = progressBar( songs.length );
					fillPlaylist( data.playlistId, songs )
				}
			} );
		}
	} );
}
