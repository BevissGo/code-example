import React from 'react'
import { RiseOutlined, FallOutlined } from '@ant-design/icons'

import './style.scss'

const NumberCard = ({ title, number, percentageChange }) => {
  let cardDescriptionIcon = null, cardDescription = '', cardDescriptionColor = ''
  if (percentageChange) {
    if (percentageChange > 0) {
      cardDescription = `+${percentageChange}% of last week`
      cardDescriptionColor = 'green'
      cardDescriptionIcon = <RiseOutlined />
    } else {
      cardDescription = `${percentageChange}% of last week`
      cardDescriptionColor = 'red'
      cardDescriptionIcon = <FallOutlined />
    }
  }

  return (
    <div className='number-card__wrapper'>
      <div className='number-card'>
        <div className='number-card__title'>
          {title}
        </div>
        <div className='number-card__number'>
          {number}
        </div>
        <div className='number-card__des' style={{ color: cardDescriptionColor }}>
          {cardDescriptionIcon} {cardDescription}
        </div>
      </div>
    </div>
  )
}

export default NumberCard