function progressBar (barLength) {
  'use strict'

  if (!$('#progressBar').length) {
    $($.handlebarTemplates.progressbar()).appendTo($('.container'))
  }

  $('#progressBarOverlay').show()
  $('#progressBar').show()
  $('#progressBarContent').html(0)
  $(document.body).addClass('blurred')

  function getCurrentValue (text) {
    const removedPercent = text.replace('%', '') || 0

    return (isNaN(removedPercent)) ? 0 : parseFloat(removedPercent)
  }

  return {
    update () {
      const actual = getCurrentValue($('#progressBarContent').html())

      const value = (actual + 100 / barLength)
      $('#progressBarContent').html(`${Math.floor(value * 10) / 10}%`)
      $('#progressBarLoader').width(`${value}%`)
    },

    finish () {
      $('#progressBarContent').html('100%')
      $('#progressBarLoader').width('100%')
    }
  }
}
