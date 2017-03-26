const randomstring = require('randomstring')
const querystring = require('querystring')
const appRootDir = require('app-root-dir').get()
const client = require(`${appRootDir}/settings.json`)

module.exports = function (req, res) {
  const stateKey = 'spotify_auth_state'
  const state = randomstring.generate(16)
  res.cookie(stateKey, state)

  const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public'
  res.redirect(`https://accounts.spotify.com/authorize?${
    querystring.stringify({
      'client_id': client.spotify.appId,
      'response_type': 'code',
      'redirect_uri': `${client.host}${client.spotify.redirectUri}`,
      scope,
      state
    })}`)
}
