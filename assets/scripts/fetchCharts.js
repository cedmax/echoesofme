/*global createPlaylist, findSongs, progressBar, getWeek */

function fetchCharts( market, config ) {

	function submitHandler( id, key ) {
		return function() {
			$( '#submit' + id ).attr( 'disabled', 'disabled' );
			$.ajax( {
				url: '/charts',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify( {
					uri: $( '#' + id ).val()
				} ),
				success: function( songs ) {
					findSongs( songs, market, progressBar, function( songResult ) {
						createPlaylist( songResult, $( '#' + id + ' option:selected' ).text() + ' ' + key + ' chart - week #' + getWeek(), config );
					} );
				}
			} );
		};
	}

	$.ajax( {
		url: '/charts',
		success: function( chartResponse ) {
			$( '#chart span' ).hide();
			for ( var key in chartResponse ) {
				if ( chartResponse.hasOwnProperty( key ) ) {
					var id = key.replace( / +?/g, '' );

					$( '#chart' ).append(
						$.handlebarTemplates.charts( {
							title: key,
							id: id,
							href: chartResponse[key].url
						} )
					);

					for ( var nation in chartResponse[key].data ) {
						$( '#' + id ).append( '<option value="' + chartResponse[key][ nation ] + '">' + nation + '</option>' );
					}

					$( '#submit-' + id ).on( 'click',  submitHandler( id, key ) );
				}
			}
		}
	} );
}