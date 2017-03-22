

import React from 'react'
import { render } from 'react-dom'
import App from 'app'
import { Provider } from 'react-redux'
import Promise from 'promise-polyfill'
import store from 'store'
import globalStyles from 'styles/global.scss'

if (!window.Promise) {
  window.Promise = Promise
}

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept('app', () => {
    const NextApp = require('app').default

    render(
      <Provider store={store}>
        <NextApp />
      </Provider>,
      document.getElementById('root')
    )
  })
}
