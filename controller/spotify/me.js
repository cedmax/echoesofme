
module.exports = function( req, res ) {
	'use strict';

	var request = require( 'request' );

	var meOpt = {
		url: 'https://api.spotify.com/v1/me',
		headers: {
			'Authorization': 'Bearer ' + req.query.at
		}
	};

	request.get( meOpt, function( error, response, body ) {
		res.send( JSON.parse( body ) );
	} );
};