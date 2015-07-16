function findSongs( songs, market, progressBar, callback ) {
	'use strict';

	var youtubeIds = [];

	function fetchSongs( queue ) {
		var song = queue.shift();
		progressBar.update();

		if ( song ) {
			$.get( '/youtube/search?q=' + encodeURIComponent( song.title ) + ' ' + encodeURIComponent( song.artist ), function( response ) {
				var videoRes = response && response.items && response.items[ 0 ];

				var videoId = videoRes && videoRes.id && videoRes.id.videoId;

				if ( videoId ) {
					youtubeIds.push( videoId );
				}
				fetchSongs( queue );
			} );
		}

		else {
			progressBar.finish();
			callback( youtubeIds );
		}
	}

	progressBar = progressBar( songs.length );
	fetchSongs( songs );
}