
module.exports = function (req, res) {
  'use strict'

  const randomstring = require('randomstring')
  const querystring = require('querystring')
  const client = require(`${__dirname}/../../settings.json`)

  const stateKey = 'spotify_auth_state'
  const state = randomstring.generate(16)
  res.cookie(stateKey, state)

	// your application requests authorization
  const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public'
  res.redirect(`https://accounts.spotify.com/authorize?${
		querystring.stringify({
  response_type: 'code',
  client_id: client.spotify.appId,
  scope,
  redirect_uri: client.spotify.redirectUri,
  state
})}`)
}
