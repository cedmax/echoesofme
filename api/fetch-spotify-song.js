const request = require('request')
const querystring = require('querystring')

function fetchSpotifySong (q, callback) {
  const url = `https://api.spotify.com/v1/search?${
    querystring.stringify({
      q: `${q.track} artist:${q.artist}`,
      type: 'track',
      limit: 1
    })}`

  request({
    url
  }, (error, response, body) => {
    callback(error, response.statusCode, body)
  })
}

module.exports = function (req, res) {
  if (req.query.track && req.query.artist) {
    fetchSpotifySong(req.query, (err, status, body) => {
      if (!err && status === 200) {
        res.json(JSON.parse(body))
      }

      res.status(500).end()
    })
  }
}
