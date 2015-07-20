/*global GMaps */
	
function showMap( res ) {
	var html = '<div class="marker"><img src="{{imgsrc}}" style=""/>{{title}}<small>by {{artist}}</small><small>{{date}}</small></div><br/>';

	function generateContent( tag ) {
		return html
				.replace( '{{imgsrc}}', 'http://images.shazam.com/ios/webtid/' +  tag.id + '/size/50' )
				.replace( '{{title}}', tag.title )
				.replace( '{{artist}}', tag.artist )
				.replace( '{{date}}', tag.date );
	}

	var map = new GMaps( {
		div: '#map',
		lat: res[0].geo && res[0].geo[0] || 0,
		lng: res[0].geo && res[0].geo[1] || 0
	} );

	var geolocated = {};
	$( res ).each( function( i, tag ) {
		if ( tag.geo ) {
			var lat = Math.round( tag.geo[0] * 100 ) / 100;
			var lng = Math.round( tag.geo[1] * 100 ) / 100;
			var key = lat + "/" + lng;
			if ( !geolocated[key] ) {
				geolocated[key] = [];
			}

			geolocated[key].push( tag );
		}
	} );

	for ( var geo in geolocated ) {
		if ( geolocated.hasOwnProperty( geo ) ) {
			var geoCoord = geo.split( '/' );
			map.addMarker( {
				lat: geoCoord[0],
				lng: geoCoord[1],
				title:  geolocated[geo].length + ' track' + ( ( geolocated[geo].length !== 1 ) ? 's' : '' ) + ' shazammed',
				infoWindow: {
					content: geolocated[geo].map( generateContent ).join( '' )
				}
			} );
		}
	}

	map.fitZoom();
}