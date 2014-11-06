function progressBar( barLength ) {
	'use strict';

	function getCurrentValue( text ) {
		var removedPercent = text.replace( '%', '' );
		return ( isNaN( removedPercent ) ) ? 0 : parseFloat( removedPercent );
	}

	return {
		update: function() {
			var actual = getCurrentValue( document.getElementById( 'viewport_bk' ).innerHTML );
			var value = ( actual + 100 / barLength );
			document.getElementById( 'viewport_bk' ).innerHTML = Math.floor( value * 10 ) / 10 + '%';
			document.getElementById( 'viewport_bk_img' ).style.width = value + '%';
		},

		finish: function() {
			document.getElementById( 'viewport_bk' ).innerHTML = '100%';
			document.getElementById( 'viewport_bk_img' ).style.width = '100%';
		}
	};
}