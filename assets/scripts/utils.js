function showLoggedIn() {
	$( '.loggedin' ).show();
	$( '.shazam' ).css( {
		left:  'calc(-100% + ' + ( $( '.shazam' ).height() / Math.tan( 30 ) )  + 'px)'
	} );
	$( '.service' ).css( {
		right: 'calc(-100% + ' + ( $( '.shazam' ).height() / Math.tan( 30 ) )  + 'px)'
	} );
	$( '#login' ).animate( {
		opacity: '0'
	}, 1000, function() {
		$( '#login' ).remove();
	} );
}

function reset() {
	'use strict';

	$( '#end' ).remove();
	$( '#progressBarOverlay' ).hide();
	$( '#map' ).empty();
	$( '#submit' ).removeAttr( 'disabled' );
	$( document.body ).removeClass( 'blurred' );
}

function showPlaylist( uri ) {
	$( '#progressBar' ).hide();
	$( '#progressBar' ).after(
		'<div id="end" class="shdialog"><a class="btn btn-primary" onclick="window.open(\'' + uri + '\');return false;">See your playlist</a> <span>or</span> <a class="btn btn-primary" onclick="reset();">Create a new one</a></div'
	);
}

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