function findSongs( songs, market, progressBar, callback ) {
	'use strict';
	var youtubeIds = [];

	gapi.client.load( 'youtube', 'v3', function() {
		function fetchSongs( queue ) {
			var song = queue.shift();
			progressBar.update();
			if ( song ) {
				var q = song.title + ' ' + song.artist
				var request = gapi.client.youtube.search.list( {
					q: q,
					part: 'snippet',
					maxResults: 1,
					type: 'video',
					videoCategoryId: 10
				} );

				request.execute( function( response ) {
					var videoRes = response && response.items && response.items[ 0 ];
					var videoId = videoRes && videoRes.id && videoRes.id.videoId;
					if ( videoId ) {
						youtubeIds.push( videoId );
					}
					fetchSongs( queue );
				} );
			} else {
				progressBar.finish();
				callback( youtubeIds );
			}
		}
		progressBar = progressBar( songs.length );
		fetchSongs( songs );

	} );

}