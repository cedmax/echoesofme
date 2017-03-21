
module.exports = function (req, res) {
  'use strict'

  const querystring = require('querystring')
  const client = require(`${__dirname}/../../settings.json`)

	// your application requests authorization
  const perms = 'basic_access,manage_library'
  res.redirect(`https://connect.deezer.com/oauth/auth.php?${
		querystring.stringify({
  app_id: client.deezer.appId,
  perms,
  redirect_uri: client.deezer.redirectUri
})}`)
}
