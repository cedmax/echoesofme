function findSongs( songs, market, progressBar, callback ) {
	'use strict';

	var spotifyUrls = [];

	function fetchSongs( queue ) {
		var song = queue.shift();
		progressBar.update();

		if ( song ) {
			$.get( '/deezer/search?track=' + encodeURIComponent( song.title ) + '&artist=' + encodeURIComponent( song.artist ) + '&market=' + market, function( response ) {
				var tracksRes = response.data;

				var trackId = tracksRes[0] && tracksRes[0].id;

				if ( trackId ) {
					spotifyUrls.push( trackId );
				}
				fetchSongs( queue );
			} );
		} else {
			progressBar.finish();
			callback( spotifyUrls );
		}
	}

	progressBar = progressBar( songs.length );
	fetchSongs( songs );
}