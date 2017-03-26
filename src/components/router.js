import React from 'react'
import { RouterMixin } from 'react-mini-router'
import Home from 'components/pages/home'

const Router = React.createClass({
  mixins: [ RouterMixin ],

  render () {
    return this.renderCurrentRoute()
  },

  routes: {
    '/': 'home'
  },

  home (props) {
    return (
      <Home {...props} />
    )
  },

  notFound (path) {
    return <div class="not-found">Page Not Found: {path}</div>
  }
})

export default Router
