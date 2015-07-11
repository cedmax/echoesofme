function fetchCharts( market, config ) {
	$.ajax( {
		url: '/charts',
		success: function( chartResponse ) {
			$('#chart span').hide();
			for ( var key in chartResponse ) {
				if (chartResponse.hasOwnProperty(key)){
					var id = key.replace(/ +?/g, '');
					
					$('#chart').append(
						$.handlebarTemplates.charts({
							title: key,
							id: id
						})
					);

					for ( var nation in chartResponse[key] ) {
						$( '#' + id ).append( '<option value="' + chartResponse[key][ nation ] + '">' + nation + '</option>' );
					}

					$( '#submit-' + id ).on( 'click', function() {
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
									createPlaylist( songResult, $( '#'+ id + ' option:selected' ).text() + ' ' + key  +' Chart - week #' + getWeek(), config );
								} );
							}
						} );
					} );
				}
			};
		}
	} );
}