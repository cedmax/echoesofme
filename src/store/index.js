import {combineReducers, createStore} from 'redux'
import defaultState from 'store/default-state'

import splash from 'store/reducers/splash'

const rootReducer = combineReducers({
  splash
})

export default createStore(rootReducer, defaultState())
