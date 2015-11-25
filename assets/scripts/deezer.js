/*global showLoggedIn, FileLoader, console, progressBar, createPlaylist, findSongs, getHashParams, showPlaylist, fetchCharts */

$( document ).autoBars( function() {
	'use strict';

	var params = getHashParams(),
		userProfilePlaceholder = document.getElementById( 'user-profile' );

	var access_token = params.access_token,
		error = params.error;

	if ( error ) {
		console.log( 'auth error' );
	} else {
		if ( access_token ) {

			$.ajax( {
				url: '/deezer/me?at=' + access_token,
				success: function( userResponse ) {
					if ( !userResponse.error ) {
						console.log( userResponse )
						userProfilePlaceholder.innerHTML = $.handlebarTemplates.deezer( {
							display_name: userResponse.firstname,
							image: userResponse.picture_medium
						} );

						var config = {
							accessToken: access_token,
							userId: userResponse.id,
							success: showPlaylist
						};

						fetchCharts( userResponse.country, config );

						new FileLoader( userResponse.country, findSongs, progressBar, function( songs ) {
							createPlaylist( songs, 'Shazam To Deezer', config );
						} );

						showLoggedIn();
					} else {
						document.location.href = '/deezer.html#error=invalid_token'
					}
				}
			} );
		}
	}
} );