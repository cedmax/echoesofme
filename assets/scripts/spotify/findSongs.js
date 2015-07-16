function findSongs( songs, market, progressBar, callback ) {
	'use strict';

	var spotifyUrls = [];

	function fetchSongs( queue ) {
		var song = queue.shift();
		progressBar.update();

		if ( song ) {
			$.get( '/spotify/search?q=' + encodeURIComponent( song.title ) + ' artist:' + encodeURIComponent( song.artist ) + '&market=' + market, function( response ) {
				var tracksRes = response.tracks;

				var trackUri = tracksRes && tracksRes.items && tracksRes.items[ 0 ] && tracksRes.items[ 0 ].uri;

				if ( trackUri ) {
					spotifyUrls.push( trackUri );
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