/* global getHashParams, global gapi, progressBar: true */

function createPlaylist (songs, title, config) {
  'use strict'

  const params = getHashParams()

  $.ajax({
    url: `/youtube/playlist?at=${params.access_token}&title=${title}`,
    contentType: 'application/json',
    success (data) {
      gapi.client.load('youtube', 'v3', () => {
        function fillPlaylist (playlistId, queue) {
          const song = queue.shift()
          progressBar.update()

          if (song) {
            const request = gapi.client.youtube.playlistItems.insert({
              part: 'snippet',
              resource: {
                snippet: {
                  playlistId,
                  resourceId: {
                    videoId: song,
                    kind: 'youtube#video'
                  }
                },
                position: 0
              }
            })
            request.execute(() => {
              fillPlaylist(playlistId, queue)
            })
          } else {
            progressBar.finish()
            config.success(playlistId)
          }
        }

        if (!data.playlistId) {
          const request = gapi.client.youtube.playlists.insert({
            part: 'snippet,status',
            resource: {
              snippet: {
                title
              },
              status: {
                privacyStatus: 'private'
              }
            }
          })

          request.execute((response) => {
            const result = response.result

            if (result) {
              const playlistId = result.id
              progressBar = progressBar(songs.length)
              fillPlaylist(playlistId, songs)
            }
          })
        } else {
          if (data.lastSong) {
            songs = songs.slice(songs.indexOf(data.lastSong) + 1)
          }
          progressBar = progressBar(songs.length)
          fillPlaylist(data.playlistId, songs)
        }
      })
    }
  })
}
