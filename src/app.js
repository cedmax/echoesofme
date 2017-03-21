import React from 'react'
import globalStyles from 'styles/global.scss'
import style from 'styles/splash.scss'
import cx from 'classnames'

export default function () {
  return (
    <div className={style.container}>
      <div className={cx(style.service, style.shazam)}><div className={style.stretched} /></div>
      <div className={cx(style.service, style.spotify)}><div className={style.stretched} /></div>
      <div className={style.dialog}>
        <h2 className={style.lead}>Echoes of Me</h2>
        <div className={style.instructions}>
          Drag this button to your bookmarks <br /><br /><a className={style.bookmark} href="javascript:(function(){window.location.href='https://echoesof.me/?shazam='+shz.app.cookies.get('inid')})()">Echoes of Me</a><br /><br />

          Navigate to <a href="https://shazam.com/myshazam">My Shazam</a> and login<br /><br />
          Click the bookmark and enjoy the magic
        </div>
      </div>
    </div>
  )
}
