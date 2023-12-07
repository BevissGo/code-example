import React from 'react'

import './style.scss'

const Step = ({
  title,
  imgSrc,
  action,
  description,
}) => {
  return (
    <div className='step'>
      <div className='step__content'>
        <h2 className='step__title'>{title}</h2>
        <div className='step__description'>
          <span>{description}</span>
        </div>
        <div className='step__action'>
          {action}
        </div>
      </div>
      <div className='step__img'>
        <img src={imgSrc} alt='' />
      </div>
    </div>
  )
}

export default Step