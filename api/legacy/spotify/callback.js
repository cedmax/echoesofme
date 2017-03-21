
module.exports = function (req, res) {
  'use strict'

  const querystring = require('querystring')
  const request = require('request')
  const client = require(`${__dirname}/../../settings.json`)

  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[ 'spotify_auth_state' ] : null

  if (state === null || state !== storedState) {
    res.redirect(`/#${
			querystring.stringify({
  error: 'state_mismatch'
})}`)
  } else {
    res.clearCookie('spotify_auth_state')
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri: client.spotify.redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': `Basic ${new Buffer(`${client.spotify.appId}:${client.spotify.secret}`).toString('base64')}`
      },
      json: true
    }

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let access_token = body.access_token,
          refresh_token = body.refresh_token

				// we can also pass the token to the browser to make requests from there
        res.redirect(`/#${
					querystring.stringify({
  access_token,
  refresh_token
})}`)
      } else {
        res.redirect(`/#${
					querystring.stringify({
  error: 'invalid_token'
})}`)
      }
    })
  }
}
