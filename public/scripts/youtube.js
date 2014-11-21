/*global gapi, handleClientLoad: true*/

var youtubeLogin = (function(){
	'use strict';

	var clientId = '475278007107-ngh79hvjc4k5l5ti6iduveihhjqmc7re.apps.googleusercontent.com';
	var apiKey = 'AIzaSyDpK9rXjoUSavQF2oo1TyRq3-XkDtRkQ3k';
	var scopes = 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/youtubepartner';

	var userProfileSource = document.getElementById( 'user-profile-template' ).innerHTML,
	userProfileTemplate = Handlebars.compile( userProfileSource ),
	userProfilePlaceholder = document.getElementById( 'user-profile' );
	
	function makeApiCall() {
		gapi.client.load('plus', 'v1', function() {
			var request = gapi.client.plus.people.get({
				'userId': 'me'
			});
			request.execute(function(resp) {
				var userResponse = {
					display_name: resp.displayName,
					images: {
						0: {
							url: resp.image.url
						}
					}
				};
				userProfilePlaceholder.innerHTML = userProfileTemplate( userResponse );
				showLoggedIn();
				new FileLoader( userResponse.country, findSongs, progressBar, function( songs ) {
					createPlaylist( songs, 'MyShazam', {
						success: function(plID){
							showPlaylist('https://www.youtube.com/playlist?list=' + plID);
						}
					});
				} );
			});
		});
	}

	function handleAuthResult(authResult) {
		var authorizeButton = document.getElementById('youtube-auth');
		if (authResult && !authResult.error) {
			makeApiCall();
		} else {
			authorizeButton.onclick = handleAuthClick;
		}
	}
	
	function handleAuthClick() {
		gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
		return false;
	}

	function checkAuth() {
		gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
	}

	var handleClientLoad = function() {
		gapi.client.setApiKey(apiKey);
		window.setTimeout(checkAuth,1);
	};

	return handleClientLoad;
})();