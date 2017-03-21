
module.exports = function (req, res) {
  'use strict'

  const request = require('request')

  const meOpt = {
    url: 'https://api.spotify.com/v1/me',
    headers: {
      'Authorization': `Bearer ${req.query.at}`
    }
  }

  request.get(meOpt, (error, response, body) => {
    res.send(JSON.parse(body))
  })
}
