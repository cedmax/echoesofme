/* global moment, showMap */

function FileLoader (market, findSongs, progressBar, callback) {
  'use strict'

  function handleLocalFile (file) {
    if (file.type.match(/text.*/)) {
      const reader = new FileReader()
      reader.onload = function (e) {
        const $newDom = $(e.target.result)
        const songListTr = $newDom.find('tr')
        const songs = []

        for (let i = 1; i < songListTr.length; i++) {
          const songDetails = $(songListTr[ i ]).find('td')
          const song = {
            id: $(songDetails[ 0 ]).find('a').attr('href').replace('http://shz.am/t', ''),
            title: $(songDetails[ 0 ]).text(),
            artist: $(songDetails[ 1 ]).text(),
            date: moment($(songDetails[ 2 ]).text(), 'DD-MMM-YYYY hh:mm').format('DD MMMM YYYY')
          }

          const geoData = $(songDetails[ 3 ]).find('a')
          if (geoData.length) {
            song.geo = geoData.attr('href').replace('https://google.com/maps/?q=', '').split(',')
          }

          songs.push(song)
        }
        findSongs(songs, market, progressBar, callback)
        showMap(songs.slice(0))
      }
      reader.readAsText(file)
    }
  }

  document.getElementById('viewport').addEventListener('dragover', (e) => {
    document.getElementById('viewport').classList.add('active')
    e.stopPropagation()
    e.preventDefault()
  }, false)

  document.getElementById('file-selector').style.visibility = 'hidden'

  document.getElementById('viewport').addEventListener('click', (e) => {
    e.stopPropagation()
    e.preventDefault()
    document.getElementById('file-selector').click()
  }, false)

  document.getElementById('file-selector').addEventListener('change', function () {
    const files = this.files

    if (files.length) {
      handleLocalFile(files[ 0 ])
    }
  })

  document.getElementById('viewport').addEventListener('drop', (e) => {
    document.getElementById('viewport').classList.remove('active')
    e.stopPropagation()
    e.preventDefault()

    const files = e.dataTransfer.files

    if (files.length) {
      handleLocalFile(files[ 0 ])
    }
  }, false)
}
