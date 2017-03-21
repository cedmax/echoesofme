/* global gapi, console, showLoggedIn, FileLoader, findSongs, progressBar, createPlaylist, showPlaylist */

const youtubeLogin = (function () {
  'use strict'

  const clientId = '475278007107-ngh79hvjc4k5l5ti6iduveihhjqmc7re.apps.googleusercontent.com'
  const apiKey = 'AIzaSyDpK9rXjoUSavQF2oo1TyRq3-XkDtRkQ3k'
  const scopes = 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/youtubepartner'
  const userProfilePlaceholder = document.getElementById('user-profile')

  function makeApiCall () {
    gapi.client.load('plus', 'v1', () => {
      const request = gapi.client.plus.people.get({
        'userId': 'me'
      })
      $(document).autoBars(() => {
        request.execute((resp) => {
          if (resp.error) {
            console.log('auth error')
          } else {
            userProfilePlaceholder.innerHTML = $.handlebarTemplates.youtube({
              display_name: resp.displayName,
              image: resp.image.url
            })
            showLoggedIn()

            const config = {
              success (plID) {
                showPlaylist(`https://www.youtube.com/playlist?list=${plID}`)
              }
            }

            new FileLoader(null, findSongs, progressBar, (songs) => {
              createPlaylist(songs, 'Shazam to Youtube', config)
            })
          }
        })
      })
    })
  }

  function handleAuthResult (authResult) {
    const authorizeButton = document.getElementById('auth')

    if (authResult && !authResult.error) {
      document.location.hash = `access_token=${authResult.access_token}`
      makeApiCall()
    } else {
      authorizeButton.onclick = handleAuthClick
    }
  }

  function handleAuthClick () {
    gapi.auth.authorize({
      client_id: clientId,
      scope: scopes,
      immediate: false
    }, handleAuthResult)

    return false
  }

  function checkAuth () {
    gapi.auth.authorize({
      client_id: clientId,
      scope: scopes,
      immediate: true
    }, handleAuthResult)
  }

  const handleClientLoad = function () {
    gapi.client.setApiKey(apiKey)
    window.setTimeout(checkAuth, 1)
  }

  return handleClientLoad
})()
