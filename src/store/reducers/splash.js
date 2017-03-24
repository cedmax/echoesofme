import constants from 'store/constants'
import defaultState from 'store/default-state'

import {
  updateState,
  performAction
} from 'store/helpers'

const actions = {
  [constants.HIDE_SPLASH]: (state) => updateState(state, {
    visible: false
  })
}

module.exports = function (state = defaultState.splash, action) {
  return performAction(state, actions, action.type)
}
