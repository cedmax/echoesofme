/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
( function() {
	'use strict';
	var replay = require( 'replay' );

	var express = require( 'express' ); // Express web server framework
	var bodyParser = require( 'body-parser' );
	var cookieParser = require( 'cookie-parser' );
	var client = require( './settings.json' );

	var app = express();
	app.use( bodyParser.json() );

	app.use( express.static( __dirname + '/public' ) )
		.use( cookieParser() );

	app.get( '/login', require( './controller/login' )( client ) );
	app.get( '/me', require( './controller/me' )( client ) );

	app.get( '/callback', require( './controller/callback' )( client ) );

	app.get( '/search', require( './controller/search' )( client ) );
	app.post( '/playlist', require( './controller/playlist' )( client ) );

	app.get( '/refresh_token', require( './controller/refresh_token' )( client ) );
	app.listen( 8888 );

} )();