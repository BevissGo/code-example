import React from 'react'

import './style.scss'

function DetailBox({ title, children }) {
  return (
    <div className='business-profile-detail-box'>
      <p className='business-profile-detail-box__title'>{title}</p>
      {children}
    </div>
  )
}

export default DetailBox
