export function fetchShazam (params) {
  return fetch(`/api/shazam/${params.shazam}?codever=${params.codever}`)
}
