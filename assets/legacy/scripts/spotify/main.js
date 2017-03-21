/* global showLoggedIn, FileLoader, console, progressBar, createPlaylist, findSongs, getHashParams, showPlaylist */

$(document).autoBars(() => {
  'use strict'

  let params = getHashParams(),
    userProfilePlaceholder = document.getElementById('user-profile')

  let access_token = params.access_token,
    error = params.error

  if (error) {
    console.log('auth error')
  } else {
    if (access_token) {
      $.ajax({
        url: `/spotify/me?at=${access_token}`,
        success (userResponse) {
          userProfilePlaceholder.innerHTML = $.handlebarTemplates.spotify({
            display_name: userResponse.display_name,
            image: userResponse.images && userResponse.images[ 0 ].url
          })

          const config = {
            accessToken: access_token,
            userId: userResponse.id,
            success: showPlaylist
          }

          new FileLoader(userResponse.country, findSongs, progressBar, (songs) => {
            createPlaylist(songs, 'Shazam To Spotify', config)
          })

          showLoggedIn()
        }
      })
    }
  }
})
