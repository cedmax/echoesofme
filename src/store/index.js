import {combineReducers, createStore} from 'redux'
import defaultState from 'store/default-state'

import splashReducer from 'store/reducers/splash'

const rootReducer = combineReducers({
  splash: splashReducer
})

export default createStore(rootReducer, defaultState())
