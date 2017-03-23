import constants from 'store/constants'
import defaultState from 'store/default-state'

module.exports = function (state, action) {
  const newstate = Object.assign({}, state)
  switch (action.type) {
    case constants.HIDE_SPLASH:
      newstate.visible = false
      return newstate
    default: return state || defaultState().splash
  }
}
