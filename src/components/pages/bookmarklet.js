import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actionsCreator from 'store/actions-creator'
import Dialog from 'components/modules/dialog'

function Bookmarklet (props) {
  return (
    <Dialog visible={props.splash.visible} title="Echoes of Me">
      Create playlists on Spotify, Youtube and Deezer from your Shazam data.

      <button onClick={props.actions.showSplash}>cont inue</button>
    </Dialog>
  )
}

const state = (state) => ({
  splash: state.splash
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionsCreator, dispatch)
})

export default connect(state, mapDispatchToProps)(Bookmarklet)
