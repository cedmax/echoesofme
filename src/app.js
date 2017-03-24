import React from 'react'
import { connect } from 'react-redux'
import Template from 'components/template'
import Router from 'components/router'

const Home = (props) => {
  return (
    <Template closed={props.splash.visible}>
      <Router history />
    </Template>
  )
}

const state = (state) => ({
  splash: state.splash
})

export default connect(state)(Home)
