import React from 'react'
import Actions from 'components/modules/actions'

export default function ListAndActions (props) {
  return (
    <div style={{overflow: 'scroll', height: '95%'}}>
      <Actions />
      <ul>
        {
          props.history && props.history.map((historyItem) => (
            <li key={historyItem.tagid}>
              <strong>{historyItem.track.heading.title}</strong> by <em>{historyItem.track.heading.subtitle}</em>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
