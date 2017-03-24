import React from 'react'
import cx from 'classnames'
import style from 'styles/template.scss'

export default function Template (props) {
  const shazamStyle = {}
  const spotifyStyle = {}

  if (!props.closed) {
    shazamStyle.left = '-100%'
    spotifyStyle.right = '-100%'
  }

  return (
    <div className={style.container}>
      <div style={shazamStyle} className={cx(style.service, style.shazam)}><div className={style.stretched} /></div>
      <div style={spotifyStyle} className={cx(style.service, style.spotify)}><div className={style.stretched} /></div>
      {props.children}
    </div>
  )
}
