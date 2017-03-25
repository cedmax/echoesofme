const request = require('request')
const FakeAgent = require('fake-agent')
const shazamUrl = 'https://www.shazam.com/discovery/v4/en-US/GB/web/-/tag/:id?limit=20'

function fetchShazam (id, query, callback) {
  const url = shazamUrl.replace(':id', id)
  request.get({
    headers: {
      'User-Agent': FakeAgent('shazam'),
      'host': 'shazam.com',
      'cookie': `codever=${query.codever}`
    },
    url
  }, (error, response, body) => {
    callback(error, body)
  })
}

module.exports = function (request, response, next) {
  if (request.params.id && request.query) {
    fetchShazam(request.params.id, request.query, (err, body) => {
      if (err) response.send('failure')
      response.json(JSON.parse(body))
    })
  }
}
