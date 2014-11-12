function FileLoader( market, findSongs, progressBar, callback ) {
	'use strict';

	function handleLocalFile( file ) {
		if ( file.type.match( /text.*/ ) ) {
			var reader = new FileReader();
			reader.onload = function( e ) {
				var $newDom = $( e.target.result );
				var songListTr = $newDom.find( 'tr' );
				var songs = [];
				for ( var i = 1; i < songListTr.length; i++ ) {
					var songDetails = $( songListTr[ i ] ).find( 'td' );
					songs.push( {
						title: $( songDetails[ 0 ] ).text(),
						artist: $( songDetails[ 1 ] ).text()
					} );
				}
				findSongs( songs, market, progressBar, callback );
			};
			reader.readAsText( file );
		}
	}

	function attachEvents() {
		document.getElementById( 'viewport' ).addEventListener( 'dragover', function( e ) {
			e.stopPropagation();
			e.preventDefault();
		}, false );

		document.getElementById( 'file-selector' ).style.display = 'none';
		document.getElementById( 'file-selector' ).addEventListener( 'click', function( e ) {
			e.stopPropagation();
			e.preventDefault();
		}, false );
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
			e.stopPropagation();
			e.preventDefault();

			var files = e.dataTransfer.files;

			if ( files.length ) {
				handleLocalFile( files[ 0 ] );
			}
		}, false );
	}

	attachEvents();
}