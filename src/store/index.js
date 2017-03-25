import { createStore, combineReducers, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise'

import splash from 'store/reducers/splash'
import myshazam from 'store/reducers/myshazam'

const rootReducer = combineReducers({
  splash,
  myshazam
})

export default createStore(rootReducer, applyMiddleware(promiseMiddleware))
