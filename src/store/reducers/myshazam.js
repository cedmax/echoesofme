import constants from 'store/constants'
import defaultState from 'store/default-state'
import _ from 'lodash'
import {
  updateState,
  setActions
} from 'store/helpers'

const IDENTIFIER = 'timestamp'

const performAction = setActions({
  [constants.FETCH_SHAZAM]: (state, payload) => {
    const history = (state && state.history) || []
    const tags = payload.tags
    const newTags = _.differenceBy(tags, history, IDENTIFIER)

    if (!newTags.length) {
      delete payload.token
    }

    return updateState(state, {
      token: payload.token,
      history: _.reverse(
        _.sortBy(
          _.uniqBy(
            [...history, ...newTags],
            IDENTIFIER
          ),
          IDENTIFIER)
        )
    })
  }
})

module.exports = function (state = defaultState.myshazam, action) {
  return performAction(state, action)
}
