import React from 'react'

import './style.scss'

const DefaultButtonV2 = ({ onClick, children}) => {
  return (
    <button className='button-default-v2' onClick={onClick}>
      {children}
    </button>
  )
}

export default DefaultButtonV2
