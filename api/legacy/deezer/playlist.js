module.exports = function (req, res) {
  'use strict'

  let request = require('request')
  const querystring = require('querystring')
  const extractQs = require('url-querystring')
  let config

  function addToPlaylist (playlist, queue, callback) {
    const set = queue.splice(0, 30)
		// set = set.reverse();

    const fillPlaylistOptions = config({
      url: `${playlist}?${querystring.stringify({
        songs: set.join(',')
      })}`
    })

    request.post(fillPlaylistOptions, () => {
      if (queue.length) {
        addToPlaylist(playlist, queue, callback)
      } else {
        callback()
      }
    })
  }

  function createNewPlaylist (user, title, songs, res) {
    const newPlayListOptions = config({
      url: `https://api.deezer.com/user/${user}/playlists?title=${title}`
    })

    request.post(newPlayListOptions, (error, response, body) => {
      const playlistId = body && body.id

      addToPlaylist(`https://api.deezer.com/playlist/${playlistId}/tracklist`, songs, () => {
        res.send(`http://www.deezer.com/playlist/${body.id}`)
        request = response = body = null
      })
    })
  }

  function addSongsToExistingPlaylist (playlist, songs, res) {
    const existingPlaylistOptions = config({
      url: `${playlist.tracklist}?limit=1`
    })

    request.get(existingPlaylistOptions, (error, response, body) => {
      const lastSong = body && body.data && body.data[0] && body.data[0].id
      if (lastSong) {
        songs = songs.slice(songs.indexOf(lastSong) + 1)
      }

      if (songs.length) {
        addToPlaylist(playlist.tracklist, songs, () => {
          res.send(playlist.link)
          request = response = body = null
        }, true)
      } else {
        res.send(playlist.link)
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
      url: url || `http://api.deezer.com/user/${user}/playlists`
    })

    request.get(getUserPlaylistsOptions, (error, response, body) => {
      if (body && body.data && body.data.length) {
        const shazamPlaylist = body.data.filter((playlist) => {
          return playlist.title === title && playlist.creator.id === parseInt(user, 10)
        })

        if (shazamPlaylist.length) {
          cb(shazamPlaylist[0])
        } else if (body.next) {
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
    const urlObj = extractQs(confObj.url)
    const hadQs = Object.keys(urlObj.qs).length
    urlObj.qs.access_token = urlObj.qs.access_token || req.query.at
    confObj.url = urlObj.url + ((hadQs) ? '&' : '?') + querystring.stringify(urlObj.qs)
    confObj.json = true
    return confObj
  }

  getUserPlaylists(req.query.user, title, (playlist) => {
    addSongToPlaylist(playlist, req.query.user, title, songs, res)
  })
}
