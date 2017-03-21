module.exports = function (req, res) {
  'use strict'

  let request = require('request')
  const querystring = require('querystring')
  let config

  function addToPlaylist (tracksUrl, queue, callback) {
    let set = queue.splice(0, 30)
    set = set.reverse()

    const fillPlaylistOptions = config({
      url: `${tracksUrl}?position=0&${querystring.stringify({
        uris: set.join(',')
      })}`
    })

    request.post(fillPlaylistOptions, () => {
      if (queue.length) {
        addToPlaylist(tracksUrl, queue, callback)
      } else {
        callback()
      }
    })
  }

  function createNewPlaylist (user, title, songs, res) {
    const newPlayListOptions = config({
      url: `https://api.spotify.com/v1/users/${user}/playlists`,
      body: {
        'name': title,
        'public': false
      }
    })

    request.post(newPlayListOptions, (error, response, body) => {
      const tracksUrl = body && body.tracks && body.tracks.href

      addToPlaylist(tracksUrl, songs, () => {
        res.send(body.external_urls.spotify)
        request = response = body = null
      })
    })
  }

  function addSongsToExistingPlaylist (shazamPlaylist, songs, res) {
    const existingPlaylistOptions = config({
      url: `${shazamPlaylist.tracks.href}?limit=1`
    })

    request.get(existingPlaylistOptions, (error, response, body) => {
      const lastSong = body && body.items && body.items[0] && body.items[0].track.uri
      if (lastSong) {
        songs = songs.slice(songs.indexOf(body.items[0].track.uri) + 1)
      }

      if (songs.length) {
        addToPlaylist(shazamPlaylist.tracks.href, songs, () => {
          res.send(shazamPlaylist.external_urls.spotify)
          request = response = body = null
        }, true)
      } else {
        res.send(shazamPlaylist.external_urls.spotify)
        request = response = body = null
      }
    })
  }

  function addSongToPlaylist (playlist, user, title, songs, res) {
    if (playlist) {
      addSongsToExistingPlaylist(playlist, songs, res)
    } else {
      createNewPlaylist(user, title, songs, res)
    }
  }

  function getUserPlaylists (user, title, cb, url) {
    const getUserPlaylistsOptions = config({
      url: url || `https://api.spotify.com/v1/users/${user}/playlists`
    })

    request.get(getUserPlaylistsOptions, (error, response, body) => {
      if (body && body.items && body.items.length) {
        const shazamPlaylist = body.items.filter((playlist) => {
          return playlist.name === title && playlist.owner.id === user
        })

        if (shazamPlaylist.length) {
          cb(shazamPlaylist[0])
        } else if (response.body.next) {
          getUserPlaylists(user, title, cb, response.body.next)
        } else {
          cb()
        }
      } else {
        cb()
      }
      response = body = null
    })
  }

  let songs = req && req.body && req.body.songs
  const title = req && req.body && req.body.title

  songs = songs.reverse()

  config = function (confObj) {
    confObj.headers = {
      'Authorization': `Bearer ${req.query.at}`
    }
    confObj.json = true
    return confObj
  }

  getUserPlaylists(req.query.user, title, (playlist) => {
    addSongToPlaylist(playlist, req.query.user, title, songs, res)
  })
}
