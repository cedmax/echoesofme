import constants from 'store/constants'
import defaultState from 'store/default-state'

module.exports = function (state, action) {
  const newstate = Object.assign({}, state)
  switch (action.type) {
    case constants.SHOW_SPLASH:
      newstate.visible = true
      return newstate
    default: return state || defaultState().splash
  }
}
