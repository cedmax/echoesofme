module.exports = function( client ) {
	'use strict';

	var request = require( 'request' );
	var querystring = require( 'querystring' );

	return function( req, res ) {
		var newPlayListOptions = {
			url: 'https://api.spotify.com/v1/users/' + req.query.user + '/playlists',
			body: {
				'name': 'Shazam',
				'public': false
			},
			headers: {
				'Authorization': 'Bearer ' + req.query.at
			},
			json: true
		};

		var songs = req && req.body && req.body.songs && req.body.songs.reverse();

		request.post( newPlayListOptions, function( error, response, body ) {
			var tracksUrl = body && body.tracks && body.tracks.href;

			var fillPlaylistOptions = {
				headers: {
					'Authorization': 'Bearer ' + req.query.at
				},
				json: true
			};

			var howMany = Math.ceil(songs.length/30);

			while (songs.length){
				var set = songs.splice(0,30);

				fillPlaylistOptions.url = tracksUrl+'?' + querystring.stringify( {
					uris: set.join(',')
				} );

				request.post( fillPlaylistOptions, function (error, response, body) {
					howMany--;
				});
			}

			var checkToEnd = setInterval(function(){
				if (!howMany){
					clearInterval(checkToEnd);
					res.send(body.external_urls.spotify);
				}
			}, 500)

		});
	};
};