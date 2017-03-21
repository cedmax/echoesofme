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
        url: `/deezer/me?at=${access_token}`,
        success (userResponse) {
          if (!userResponse.error) {
            userProfilePlaceholder.innerHTML = $.handlebarTemplates.deezer({
              display_name: userResponse.firstname,
              image: userResponse.picture_medium
            })

            const config = {
              accessToken: access_token,
              userId: userResponse.id,
              success: showPlaylist
            }

            new FileLoader(userResponse.country, findSongs, progressBar, (songs) => {
              createPlaylist(songs, 'Shazam To Deezer', config)
            })

            showLoggedIn()
          } else {
            document.location.href = '/deezer.html#error=invalid_token'
          }
        }
      })
    }
  }
})
