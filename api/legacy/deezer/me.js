
module.exports = function (req, res) {
  'use strict'

  const request = require('request')
  const querystring = require('querystring')

  const meOpt = {
    url: `http://api.deezer.com/user/me?${
			querystring.stringify({
  access_token: req.query.at
})}`
  }

  request.get(meOpt, (error, response, body) => {
    res.send(JSON.parse(body))
  })
}
