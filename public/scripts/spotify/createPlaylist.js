function createPlaylist( songs, title, config ) {
	'use strict';

	$.ajax( {
		url: '/spotify/playlist?at=' + config.accessToken + '&user=' + config.userId,
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify( {
			songs: songs,
			title: title
		} ),
		success: config.success
	} );
}