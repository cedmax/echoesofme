function fetchCharts( market, config ) {
	$.ajax( {
		url: '/charts',
		success: function( chartResponse ) {
			for ( var nation in chartResponse ) {
				$( '#countries' ).append( '<option value="' + chartResponse[ nation ] + '">' + nation + '</option>' );
			}

			$( '#submit' ).on( 'click', function() {
				$( '#submit' ).attr( 'disabled', 'disabled' );
				$.ajax( {
					url: '/charts',
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify( {
						uri: $( '#countries' ).val()
					} ),
					success: function( songs ) {
						findSongs( songs, market, progressBar, function( songResult ) {
							createPlaylist( songResult, $( '#countries option:selected' ).text() + ' Chart - week #' + getWeek(), config );
						} );
					}
				} );
			} );
		}
	} );
}