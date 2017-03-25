import constants from 'store/constants'
import defaultState from 'store/default-state'

import {
  updateState,
  setActions
} from 'store/helpers'

const performAction = setActions({
  [constants.HIDE_SPLASH]: (state) => updateState(state, {
    visible: false
  })
})

module.exports = function (state = defaultState.splash, action) {
  return performAction(state, action)
}
