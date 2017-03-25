import constants from 'store/constants'
import { fetchShazam as fetchShazamApi } from 'api'
import store from 'store'

const showSplash = () => ({ type: constants.HIDE_SPLASH })

const fetchShazam = async (data) => {
  const response = await fetchShazamApi(data)
  store.dispatch(showSplash())
  return { type: constants.FETCH_SHAZAM, payload: response.json() }
}

export default {
  showSplash,
  fetchShazam
}
