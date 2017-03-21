module.exports = function (req, res) {
  'use strict'

  let config
  const client = require(`${__dirname}/../../settings.json`)
  const google = require('googleapis')
  const OAuth2 = google.auth.OAuth2
  const oauth2Client = new OAuth2(client.youtube.clientId, client.youtube.secret, client.youtube.redirectUri)

  oauth2Client.setCredentials({
    access_token: req.query.at
  })

  const youtube = google.youtube('v3')

  function findLastSongAdded (playlistId, callback) {
    const existingPlaylistOptions = config({
      part: 'snippet',
      playlistId,
      maxResults: 1
    })

    youtube.playlistItems.list(existingPlaylistOptions, (error, body) => {
      const lastSong = body && body.items && body.items[0] && body.items[0].snippet.resourceId.videoId
      callback(lastSong)
    })
  }

  function getUserPlaylists (title, cb, pageToken) {
    const confObj = config({
      part: 'snippet',
      mine: true
    })
    if (pageToken) {
      confObj.pageToken = pageToken
    }

    youtube.playlists.list(confObj, (err, body) => {
      if (body && body.items && body.items.length) {
        const shazamPlaylist = body.items.filter((playlist) => {
          return playlist.snippet.title === title
        })

        if (shazamPlaylist.length) {
          cb(shazamPlaylist[0].id)
        } else if (body.nextPageToken) {
          getUserPlaylists(title, cb, body.nextPageToken)
        } else {
          cb()
        }
      } else {
        cb()
      }
    })
  }

  config = function (confObj) {
    confObj.auth = oauth2Client
    return confObj
  }

  getUserPlaylists(req.query.title, (playlistId) => {
    findLastSongAdded(playlistId, (lastSong) => {
      res.json({
        lastSong,
        playlistId
      })
    })
  })
}
