const request = require('request')
const FakeAgent = require('fake-agent')
const shazamUrl = 'https://www.shazam.com/discovery/v4/en-US/GB/web/-/tag/:id?limit=20'

function fetchShazam (id, query, callback) {
  const url = shazamUrl.replace(':id', id) + (query.token ? `&token=${query.token}` : '')
  request.get({
    headers: {
      'User-Agent': FakeAgent('shazam'),
      'host': 'shazam.com',
      'cookie': `codever=${query.codever}`
    },
    url
  }, (error, response, body) => {
    callback(error, response.statusCode, body)
  })
}

module.exports = function (req, res, next) {
  if (req.params.id && req.query) {
    fetchShazam(req.params.id, req.query, (err, status, body) => {
      if (!err && status === 200) {
        res.json(JSON.parse(body))
      }

      res.status(500).end()
    })
  }
}
