/*global moment, showMap*/

function FileLoader( market, findSongs, progressBar, callback ) {
	'use strict';

	function handleLocalFile( file ) {
		if ( file.type.match( /text.*/ ) ) {
			var reader = new FileReader();
			reader.onload = function( e ) {
				var $newDom = $( e.target.result );
				var songListTr = $newDom.find( 'tr' );
				var songs = [];

				for ( var i = 1; i < songListTr.length; i ++ ) {
					var songDetails = $( songListTr[ i ] ).find( 'td' );
					var song = {
						id: $( songDetails[ 0 ] ).find( 'a' ).attr( 'href' ).replace( 'http://shz.am/t', '' ),
						title: $( songDetails[ 0 ] ).text(),
						artist: $( songDetails[ 1 ] ).text(),
						date: moment( $( songDetails[ 2 ] ).text(), 'DD-MMM-YYYY hh:mm' ).format( 'DD MMMM YYYY' )
					};

					var geoData = $( songDetails[ 3 ] ).find( 'a' );
					if ( geoData.length ) {
						song.geo = geoData.attr( 'href' ).replace( 'https://google.com/maps/?q=', '' ).split( ',' );
					}

					songs.push( song );
				}
				findSongs( songs, market, progressBar, callback );
				showMap( songs );
			};
			reader.readAsText( file );
		}
	}

	document.getElementById( 'viewport' ).addEventListener( 'dragover', function( e ) {
		document.getElementById( 'viewport' ).classList.add( 'active' );
		e.stopPropagation();
		e.preventDefault();
	}, false );

	document.getElementById( 'file-selector' ).style.visibility = 'hidden';

	document.getElementById( 'viewport' ).addEventListener( 'click', function( e ) {
		e.stopPropagation();
		e.preventDefault();
		document.getElementById( 'file-selector' ).click();
	}, false );

	document.getElementById( 'file-selector' ).addEventListener( 'change', function() {
		var files = this.files;

		if ( files.length ) {
			handleLocalFile( files[ 0 ] );
		}
	} );

	document.getElementById( 'viewport' ).addEventListener( 'drop', function( e ) {
		document.getElementById( 'viewport' ).classList.remove( 'active' );
		e.stopPropagation();
		e.preventDefault();

		var files = e.dataTransfer.files;

		if ( files.length ) {
			handleLocalFile( files[ 0 ] );
		}
	}, false );

}