function FileLoader( market, progressBar, callback ) {
	'use strict';
	var agent = ( function( ua ) {
		ua = ua.toLowerCase();

		var rwebkit = /(webkit)[ \/]([\w.]+)/;
		var ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
		var rmsie = /(msie) ([\w.]+)/;
		var rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf( 'compatible' ) < 0 && rmozilla.exec( ua ) ||
			[];

		return {
			browser: match[ 1 ] || '',
			version: match[ 2 ] || '0'
		};
	} )( navigator.userAgent );

	var spotifyUrls = [];

	function fetchSongs( queue ) {
		var song = queue.shift();
		progressBar.update();
		if ( song ) {
			$.get( '/search?q=' + song.title + ' ' + song.artist + '&market=' + market, function( response ) {
				var tracksRes = response.tracks;
				var trackUri = tracksRes && tracksRes.items && tracksRes.items[ 0 ] && tracksRes.items[ 0 ].uri;
				if ( trackUri ) {
					spotifyUrls.push( trackUri );
				}
				fetchSongs( queue );
			} );
		} else {
			progressBar.finish();
			callback( spotifyUrls );
		}
	}

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
				progressBar = progressBar( songs.length );
				fetchSongs( songs );
			};
			reader.readAsText( file );
		}
	}

	function attachEvents() {
		document.getElementById( 'viewport' ).addEventListener( 'dragover', function( e ) {
			e.stopPropagation();
			e.preventDefault();
		}, false );

		if ( agent.browser === 'mozilla' ) {
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
		}

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