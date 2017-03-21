/* global GMaps, smoke */

function showMap (res) {
  const html = '<div class="marker"><img src="{{imgsrc}}" style=""/>{{title}}<small>by {{artist}}</small><small>{{date}}</small></div><br/>'

  smoke.alert('Meanwhile your playlist is being created (look at the bottom),<br/> enjoy the map of your Shazams', () => {
    function generateContent (tag) {
      return html
					.replace('{{imgsrc}}', `https://images.shazam.com/ios/webtid/${tag.id}/size/50`)
					.replace('{{title}}', tag.title)
					.replace('{{artist}}', tag.artist)
					.replace('{{date}}', tag.date)
    }

    const map = new GMaps({
      div: '#map'
    })

    const geolocated = {}
    $(res).each((i, tag) => {
      if (tag.geo && (tag.geo[0] !== '0.0' || tag.geo[1] !== '0.0')) {
        const lat = Math.round(tag.geo[0] * 100) / 100
        const lng = Math.round(tag.geo[1] * 100) / 100
        const key = `${lat}/${lng}`
        if (!geolocated[key]) {
          geolocated[key] = []
        }

        geolocated[key].push(tag)
      }
    })

    for (const geo in geolocated) {
      if (geolocated.hasOwnProperty(geo)) {
        const geoCoord = geo.split('/')
        map.addMarker({
          lat: geoCoord[0],
          lng: geoCoord[1],
          title: `${geolocated[geo].length} track${(geolocated[geo].length !== 1) ? 's' : ''} shazammed`,
          infoWindow: {
            content: geolocated[geo].map(generateContent).join('')
          }
        })
      }
    }

    map.fitZoom()
  }, {
    ok: 'Awesome'
  })
}
