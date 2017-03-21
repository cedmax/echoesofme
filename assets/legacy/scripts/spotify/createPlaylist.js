function createPlaylist (songs, title, config) {
  'use strict'

  $.ajax({
    url: `/spotify/playlist?at=${config.accessToken}&user=${config.userId}`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      songs,
      title
    }),
    success: config.success
  })
}
