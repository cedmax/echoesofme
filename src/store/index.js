import { createStore, combineReducers, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise'

import splash from 'store/reducers/splash'
import shazam from 'store/reducers/shazam'

const rootReducer = combineReducers({
  splash,
  shazam
})

export default createStore(rootReducer, applyMiddleware(promiseMiddleware))
