import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import App from 'app'
import { Provider } from 'react-redux'
import Promise from 'promise-polyfill'
import store from 'store'

if (!window.Promise) {
  window.Promise = Promise
}

const rootEl = document.getElementById('root')

const render = Component => (
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    rootEl
  )
)

render(App)
if (module.hot) module.hot.accept('app', () => render(require('app').default))
