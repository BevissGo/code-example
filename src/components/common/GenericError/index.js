import React from 'react'

import './style.scss'

const GenericError = ({ message = 'Something went wrong.' }) => {
  return (
    <div className='generic-error-view'>
      <div className='generic-error-view__message'>{message}</div>
    </div>
  )
}

export default GenericError
