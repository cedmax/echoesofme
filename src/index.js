import React from 'react'
import { render } from 'react-dom'
import App from 'app'
import Promise from 'promise-polyfill'

if (!window.Promise) {
  window.Promise = Promise
}

render(
  <App />,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept('app', () => {
    const NextApp = require('app').default

    render(
      <NextApp />,
      document.getElementById('root')
    )
  })
}
