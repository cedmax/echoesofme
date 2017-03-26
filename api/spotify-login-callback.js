const querystring = require('querystring')
const request = require('request')
const appRootDir = require('app-root-dir').get()
const client = require(`${appRootDir}/settings.json`)

function loginCallback (code, callback) {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri: `${client.host}${client.spotify.redirectUri}`,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': `Basic ${new Buffer(`${client.spotify.appId}:${client.spotify.secret}`).toString('base64')}`
    },
    json: true
  }

  request.post(authOptions, (error, response, body) => {
    callback(error, response.statusCode, body)
  })
}

module.exports = function (req, res) {
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[ 'spotify_auth_state' ] : null

  if (state === null || state !== storedState) {
    res.redirect(`/#${
      querystring.stringify({
        error: 'state_mismatch'
      })}`)
  } else {
    res.clearCookie('spotify_auth_state')

    loginCallback(req.query.code || null, (error, statusCode, body) => {
      if (error || statusCode !== 200) {
        res.redirect(`/#${
          querystring.stringify({
            error: 'invalid_token'
          })
        }`)
      } else {
        res.redirect(`/#${
          querystring.stringify({
            access_token: body.access_token,
            refresh_token: body.refresh_token
          })
        }`)
      }
    })
  }
}
