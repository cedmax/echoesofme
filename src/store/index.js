import { createStore, combineReducers, applyMiddleware } from 'redux'
import { save, load } from 'redux-localstorage-simple'
import promiseMiddleware from 'redux-promise'

import splash from 'store/reducers/splash'
import myshazam from 'store/reducers/myshazam'

const rootReducer = combineReducers({
  splash,
  myshazam
})

const createStoreWithMiddlewares = applyMiddleware(
    promiseMiddleware, save()
)(createStore)

export default createStoreWithMiddlewares(rootReducer, load())
