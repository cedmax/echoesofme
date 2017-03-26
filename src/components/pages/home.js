import React, { Component } from 'react'
import ListAndActions from 'components/pages/list-and-actions'
import Bookmarklet from 'components/pages/bookmarklet'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actionsCreator from 'store/actions-creator'

class Home extends Component {
  componentWillMount () {
    const {
      shazam,
      codever
    } = this.props
    if (shazam && codever) {
      this.props.actions.fetchShazam({shazam, codever})
    }
  }

  componentWillReceiveProps (nextProps) {
    const {
      token
    } = nextProps.myshazam || {}
    if (token) {
      const {
        shazam, 
        codever
      } = nextProps
      this.props.actions.fetchShazam({token, shazam, codever})
    }
  }

  render () {
    const {
      shazam,
      codever,
      myshazam
    } = this.props

    return ((shazam && codever) || myshazam)
      ? <ListAndActions {...myshazam} />
      : <Bookmarklet />
  }
}

const state = (state) => ({
  myshazam: state.myshazam
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionsCreator, dispatch)
})

export default connect(state, mapDispatchToProps)(Home)
