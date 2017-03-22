import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import style from 'styles/splash.scss'
import cx from 'classnames'
import actions from 'store/actions'

const Home = (props) => {
  const shazamStyle = {}
  const spotifyStyle = {}
  const dialogStyle = {}
  if (props.splash.visible) {
    shazamStyle.left = '-100%'
    spotifyStyle.right = '-100%'
    dialogStyle.opacity = '0'
  }
  console.log(props)
  return (
    <div className={style.container}>
      <div style={shazamStyle} className={cx(style.service, style.shazam)}><div className={style.stretched} /></div>
      <div style={spotifyStyle} className={cx(style.service, style.spotify)}><div className={style.stretched} /></div>
      <div style={dialogStyle} className={style.dialog}>
        <h2 className={style.lead}>Echoes of Me</h2>
        <div className={style.instructions}>
          Create playlists on Spotify, Youtube and Deezer from your Shazam data.

          <button onClick={props.actions.showSplash}>continue</button>
        </div>
      </div>
    </div>
  )
}

const state = (state) => ({
  splash: state.splash
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
})

export default connect(state, mapDispatchToProps)(Home)
