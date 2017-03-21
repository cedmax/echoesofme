
module.exports = function (req, res) {
  let request = require('request')
  let cachedRequest = require('cached-request')(request)
  const cacheDirectory = `${__dirname}/../../tmp`
  cachedRequest.setCacheDirectory(cacheDirectory)
  let querystring = require('querystring')
  let client = require(`${__dirname}/../../settings.json`)

  const searchUrl = `http://api.deezer.com/search?${
			querystring.stringify({
  q: `artist:"${ req.query.artist}" track:"${ req.query.track}"`,
  limit: 1
})}`

  cachedRequest({
    url: searchUrl,
    ttl: client.cache.songs
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.json(JSON.parse(body))
    } else {
      res.status(500).end()
    }
    request = cachedRequest = querystring = client = response = body = null
  })
}
