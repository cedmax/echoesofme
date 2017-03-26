export function fetchShazam (params) {
  return fetch(`/api/shazam/${params.shazam}?codever=${params.codever}${params.token ? `&token=${params.token}` : ``}`)
}

export function fetchSpotify (params) {
  params = params.track.heading
  return fetch(`/api/spotify/search?track=${params.title}&artist=${params.subtitle}`)
}
