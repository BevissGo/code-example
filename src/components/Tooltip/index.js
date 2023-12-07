import React from 'react'

import './style.scss'

const Tooltip = (props) => {
  return (
    <div className='tooltip'>
      <div className='tooltip__content top'>{props.content}</div>
    </div>
  )
}

export default Tooltip
