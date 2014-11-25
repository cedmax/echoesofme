/*global Handlebars, FileLoader, console, progressBar,createPlaylist, findSongs */

$( document ).autoBars( function() {
	'use strict';
	/**
	 * Obtains parameters from the hash of the URL
	 * @return Object
	 */

	var params = getHashParams(),
		userProfilePlaceholder = document.getElementById( 'user-profile' );

	var access_token = params.access_token,
		error = params.error;

	if ( error ) {
		console.log( 'auth error' );
	} else {
		if ( access_token ) {

			$.ajax( {
				url: '/spotify/me?at=' + access_token,
				success: function( userResponse ) {
					userProfilePlaceholder.innerHTML = $.handlebarTemplates.spotify( {
						display_name: userResponse.display_name,
						image: userResponse.images && userResponse.images[ 0 ].url
					} );

					var config = {
						accessToken: access_token,
						userId: userResponse.id,
						success: showPlaylist
					};

					fetchCharts( userResponse.country, config );

					new FileLoader( userResponse.country, findSongs, progressBar, function( songs ) {
						createPlaylist( songs, 'MyShazams', $.extend( config, {
							reverse: true
						} ) );
					} );

					showLoggedIn();
				}
			} );
		}
	}
} );