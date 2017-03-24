import React from 'react'
import ListAndActions from 'components/pages/list-and-actions'
import Bookmarklet from 'components/pages/bookmarklet'

export default function Home (props) {
  const {
    shazam,
    codever
  } = props

  return (shazam && codever)
    ? <ListAndActions {...props} />
    : <Bookmarklet />
}
