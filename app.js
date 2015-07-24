( function() {
	'use strict';

	//require('v8-profiler');
	require( 'newrelic' );
	//var replay = require( 'replay' );

	var express = require( 'express' ); // Express web server framework
	var bodyParser = require( 'body-parser' );
	var cookieParser = require( 'cookie-parser' );
	global.client = require( './settings.json' );

	var app = express();
	app.use( bodyParser.json() );

	app.use( express.static( __dirname + '/assets' ) )
		.use( cookieParser() );

	//spotify
	app.get( '/spotify/callback', require( './controller/callback' ) );
	app.get( '/spotify/me', require( './controller/me' ) );
	app.get( '/spotify/login', require( './controller/login' ) );
	app.get( '/spotify/search', require( './controller/spotifySearch' ) );
	app.post( '/spotify/playlist', require( './controller/playlist' ) );
	//app.get( '/refresh_token', require( './controller/refresh_token' ) );

	//youtube
	app.get( '/youtube/search', require( './controller/youtubeSearch' ) );

	//shazamcrawler
	app.get( '/charts', require( './controller/charts' ) );
	app.post( '/charts', require( './controller/charts' ) );
	app.listen( global.client.port );

} )();