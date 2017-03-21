
module.exports = function (req, res) {
  const client = require(`${__dirname}/../../settings.json`)

  const google = require('googleapis')
  const youtube = google.youtube('v3')
  const OAuth2 = google.auth.OAuth2
  const oauth2Client = new OAuth2(client.youtube.clientId, client.youtube.secret, client.youtube.redirectUri)

  oauth2Client.setCredentials({
    access_token: req.query.at
  })

  const searchOptions = {
    q: req.query.q,
    part: 'snippet',
    maxResults: 1,
    type: 'video',
    videoCategoryId: 10,
    auth: oauth2Client
  }

  youtube.search.list(searchOptions, (error, response) => {
    if (!error && response) {
      res.json(response)
    } else {
      res.status(500).end()
    }
  })
}
