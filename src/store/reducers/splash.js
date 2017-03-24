import constants from 'store/constants'
import {
  updateState,
  performActionCreator
} from 'store/helpers'

const performAction = performActionCreator({
  [constants.HIDE_SPLASH]: (state) => updateState(state, {
    visible: false
  })
})

module.exports = function (state, action) {
  return performAction(state, action.type)
}
