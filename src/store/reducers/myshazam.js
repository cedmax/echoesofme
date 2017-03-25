import constants from 'store/constants'
import defaultState from 'store/default-state'
import {
  updateState,
  setActions
} from 'store/helpers'

const performAction = setActions({
  [constants.FETCH_SHAZAM]: (state, payload) => {
    const history = state && state.history || []
    return updateState(state, {
      token: payload.token,
      history: [...history, ...payload.tags]
    })
  }
})

module.exports = function (state = defaultState.myshazam, action) {
  return performAction(state, action)
}
