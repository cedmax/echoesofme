function showLoggedIn() {
	$( '#loggedin' ).show();
	$( '#shazam' ).animate( {
		left: '-100%'
	}, 3000 );
	$( '#service' ).animate( {
		right: '-100%'
	}, 3000 );
	$( '#login' ).animate( {
		opacity: '0'
	}, 2000, function() {
		$( '#login' ).remove();
	} );
}

function reset() {
	'use strict';
	$( '#end' ).remove();
	$( '#progressBarContainer' ).hide();
	$( '#submit' ).removeAttr('disabled');
	$( document.body ).removeClass('blurred');
}


function showPlaylist( uri ) {
	$( '#progressBar' ).hide();
	$( '#progressBar' ).after(
		'<div id="end" class="dialog"><a class="btn btn-primary" onclick="window.open(\'' + uri + '\');return false;">See your playlist</a><br/><br/><span>or</span><br/><br/><a class="btn btn-primary" onclick="reset();">Create a new one</a></div'
	);
}