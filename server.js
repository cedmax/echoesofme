'use strict'

const express = require('express')
const bodyParser = require('body-parser')

module.exports = (port) => {
  const app = express()
  app.use(bodyParser.json())
  app.use(express.static(`${__dirname}/assets`))
  app.use('/dist', express.static(`${__dirname}/dist`))

  // spotify
  app.get('/api/shazam/:id', require('./api/fetch-shazam-history'))
  app.use(/^(.*)$/, express.static(`${__dirname}/assets/index.html`))

  // app.get( '/spotify/callback', require( './controller/spotify/callback' ) );
  // app.get( '/spotify/me', require( './controller/spotify/me' ) );
  // app.get( '/spotify/login', require( './controller/spotify/login' ) );
  // app.get( '/spotify/search', require( './controller/spotify/search' ) );
  // app.post( '/spotify/playlist', require( './controller/spotify/playlist' ) );

  // //deezer
  // app.get( '/deezer/callback', require( './controller/deezer/callback' ) );
  // app.get( '/deezer/me', require( './controller/deezer/me' ) );
  // app.get( '/deezer/login', require( './controller/deezer/login' ) );
  // app.get( '/deezer/search', require( './controller/deezer/search' ) );
  // app.post( '/deezer/playlist', require( './controller/deezer/playlist' ) );

  // //youtube
  // app.get( '/youtube/search', require( './controller/youtube/search' ) );
  // app.get( '/youtube/playlist', require( './controller/youtube/playlist' ) );

  app.listen(port)
}

