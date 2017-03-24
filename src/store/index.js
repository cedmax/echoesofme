import {combineReducers, createStore} from 'redux'
import splash from 'store/reducers/splash'

const rootReducer = combineReducers({
  splash
})

export default createStore(rootReducer)
