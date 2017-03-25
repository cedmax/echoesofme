import constants from 'store/constants'
import defaultState from 'store/default-state'
import {
  updateState,
  setActions
} from 'store/helpers'

const performAction = setActions({
  [constants.FETCH_SHAZAM]: (state, payload) => updateState(state, {
    shazam: {
      history: payload.tags
    }
  })
})

module.exports = function (state = defaultState.shazam, action) {
  return performAction(state, action)
}
