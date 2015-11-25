
module.exports = function( req, res ) {
	'use strict';

	var request = require( 'request' );
	var querystring = require( 'querystring' );

	var meOpt = {
		url: 'http://api.deezer.com/user/me?' +
			querystring.stringify( {
				access_token: req.query.at
			} )
	};

	request.get( meOpt, function( error, response, body ) {
		res.send( JSON.parse( body ) );
	} );
};