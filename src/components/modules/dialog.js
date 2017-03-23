import React from 'react'
import style from 'styles/dialog.scss'

export default function Dialog (props) {
  const dialogStyle = {}

  if (props.visible) {
    dialogStyle.opacity = 0
  }

  return (
    <div style={dialogStyle} className={style.dialog}>
      <h2 className={style.lead}>{props.title}</h2>
      <div className={style.instructions}>
        {props.children}
      </div>
    </div>
  )
}
