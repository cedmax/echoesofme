import React, { Component } from 'react'
import ListAndActions from 'components/pages/list-and-actions'
import Bookmarklet from 'components/pages/bookmarklet'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actionsCreator from 'store/actions-creator'

class Home extends Component {
  componentWillMount () {
    if (this.props.shazam && this.props.codever) {
      this.props.actions.fetchShazam(this.props)
    }
  }

  render () {
    const {
      shazam,
      codever,
      myshazam
    } = this.props

    return (shazam && codever)
      ? <ListAndActions {...myshazam} />
      : <Bookmarklet />
  }
}

const state = (state) => ({
  myshazam: state.shazam
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionsCreator, dispatch)
})

export default connect(state, mapDispatchToProps)(Home)
