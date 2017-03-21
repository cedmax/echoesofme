/* global createPlaylist, findSongs, progressBar, getWeek */

function fetchCharts (market, config) {
  function submitHandler (id, key) {
    return function () {
      $(`#submit${id}`).attr('disabled', 'disabled')
      $.ajax({
        url: '/charts',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          uri: $(`#${id}`).val()
        }),
        success (songs) {
          findSongs(songs, market, progressBar, (songResult) => {
            createPlaylist(songResult, `${$(`#${id} option:selected`).text()} ${key} chart - week #${getWeek()}`, config)
          })
        }
      })
    }
  }

  $.ajax({
    url: '/charts',
    success (chartResponse) {
      $('#chart span').hide()
      for (const key in chartResponse) {
        if (chartResponse.hasOwnProperty(key)) {
          const id = key.replace(/ +?/g, '')

          $('#chart').append(
						$.handlebarTemplates.charts({
  title: key,
  id,
  href: chartResponse[key].url
})
					)

          for (const nation in chartResponse[key].data) {
            $(`#${id}`).append(`<option value="${chartResponse[key].data[ nation ]}">${nation}</option>`)
          }

          $(`#submit-${id}`).on('click', submitHandler(id, key))
        }
      }
    }
  })
}
