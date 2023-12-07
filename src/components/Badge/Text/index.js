import React from 'react'

import './style.scss'

const TextBadge = ({ text }) => {
  return (
    <div className='text-badge__container'>
      <div className='text-badge'>
        <div className='text'>
          {text}
        </div>
      </div>
    </div>
  )
}

export default TextBadge