import React from 'react'

import './style.scss'

function QuantityShow({ color, title, quantity }) {
  return (
    <div className='business-profile-quantity-show' style={{ backgroundColor: color }}>
      <div className='business-profile-quantity-show__title'>{title}</div>
      <div className='business-profile-quantity-show__quantity'>{quantity}</div>
    </div>
  )
}

export default QuantityShow
