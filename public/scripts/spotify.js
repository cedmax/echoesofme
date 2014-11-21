/*global Handlebars, FileLoader, console, progressBar,createPlaylist, findSongs */


(function() {
	'use strict';
	/**
	 * Obtains parameters from the hash of the URL
	 * @return Object
	 */
	function getHashParams() {
		var hashParams = {};
		var e, r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.hash.substring( 1 );
		while ( e = r.exec( q ) ) {
			hashParams[ e[ 1 ] ] = decodeURIComponent( e[ 2 ] );
		}
		return hashParams;
	}

	function getWeek() {
		var onejan = new Date( ( new Date() ).getFullYear(), 0, 1 );
		return Math.ceil( ( ( ( new Date() - onejan ) / 86400000 ) + onejan.getDay() + 1 ) / 7 );
	}

	var userProfileSource = document.getElementById( 'user-profile-template' ).innerHTML,
		userProfileTemplate = Handlebars.compile( userProfileSource ),
		userProfilePlaceholder = document.getElementById( 'user-profile' );

	var params = getHashParams();

	var access_token = params.access_token,
		error = params.error;

	if ( error ) {
		console.log( 'auth error' );
	} else {
		if ( access_token ) {
			// render oauth info
			$.ajax( {
				url: '/me?at=' + access_token,
				success: function( userResponse ) {
					userProfilePlaceholder.innerHTML = userProfileTemplate( userResponse );

					$.ajax( {
						url: '/charts',
						success: function( chartResponse ) {
							for ( var nation in chartResponse ) {
								$( '#countries' ).append( '<option value="' + chartResponse[ nation ] + '">' + nation + '</option>' );
							}

							$( '#submit' ).on( 'click', function() {
								$( '#submit' ).attr('disabled', 'disabled');
								$.ajax( {
									url: '/charts',
									type: 'POST',
									contentType: 'application/json',
									data: JSON.stringify( {
										uri: $( '#countries' ).val()
									} ),
									success: function( songs ) {
										findSongs( songs, userResponse.country, progressBar, function( spotifySongs ) {
											createPlaylist( spotifySongs, $( '#countries option:selected' ).text() + ' Chart - week #' + getWeek(), {
												accessToken: access_token,
												userId: userResponse.id,
												success: showPlaylist
											} );
										} );
									}
								} );
							} );
						}
					} );

					new FileLoader( userResponse.country, findSongs, progressBar, function( songs ) {
						createPlaylist( songs, 'MyShazam', {
							accessToken: access_token,
							reverse: true,
							userId: userResponse.id,
							success: showPlaylist
						} );
					} );

					showLoggedIn();
				}
			} );
		}
	}
})();