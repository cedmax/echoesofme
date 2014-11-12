function progressBar( barLength ) {
	'use strict';

	$( '#progressBarContainer' ).show();
	$( '#progressBar' ).show();
	$( '#progressBarContent' ).html( 0 );
	$( document.body ).addClass( 'blurred' );

	function getCurrentValue( text ) {
		var removedPercent = text.replace( '%', '' ) || 0;
		return ( isNaN( removedPercent ) ) ? 0 : parseFloat( removedPercent );
	}

	return {
		update: function() {
			var actual = getCurrentValue( $( '#progressBarContent' ).html() );
			var value = ( actual + 100 / barLength );
			$( '#progressBarContent' ).html( Math.floor( value * 10 ) / 10 + '%' );
			$( '#progressBarLoader' ).width( value + '%' );
		},

		finish: function() {
			$( '#progressBarContent' ).html( '100%' );
			$( '#progressBarLoader' ).width( '100%' );
		}
	};
}