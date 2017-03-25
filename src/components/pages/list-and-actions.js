import React from 'react'

export default function ListAndActions (props) {
  return (
    <ul style={{overflow: 'scroll', height: '95%'}}>
      {
        props.shazam && props.shazam.history.map(historyItem => (
          <li key={historyItem.tagid}>
            <strong>{historyItem.track.heading.title}</strong> by <em>{historyItem.track.heading.subtitle}</em>
          </li>
        ))
      }
    </ul>
  )
}
