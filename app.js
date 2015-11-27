'use strict';

//require('v8-profiler');
//require( 'newrelic' );
//var replay = require( 'replay' );

var express = require( 'express' ); // Express web server framework
var bodyParser = require( 'body-parser' );
var cookieParser = require( 'cookie-parser' );
var client = require( __dirname + '/settings.json' );

var app = express();
app.use( bodyParser.json() );

app.use( express.static( __dirname + '/assets' ) )
	.use( cookieParser() );

//spotify
app.get( '/spotify/callback', require( './controller/spotify/callback' ) );
app.get( '/spotify/me', require( './controller/spotify/me' ) );
app.get( '/spotify/login', require( './controller/spotify/login' ) );
app.get( '/spotify/search', require( './controller/spotify/search' ) );
app.post( '/spotify/playlist', require( './controller/spotify/playlist' ) );

//deezer
app.get( '/deezer/callback', require( './controller/deezer/callback' ) );
app.get( '/deezer/me', require( './controller/deezer/me' ) );
app.get( '/deezer/login', require( './controller/deezer/login' ) );
app.get( '/deezer/search', require( './controller/deezer/search' ) );
app.post( '/deezer/playlist', require( './controller/deezer/playlist' ) );

//youtube
app.get( '/youtube/search', require( './controller/youtube/search' ) );
app.get( '/youtube/playlist', require( './controller/youtube/playlist' ) );

//shazamcrawler
app.get( '/charts', require( './controller/charts' ) );
app.post( '/charts', require( './controller/charts' ) );
app.listen( client.port );