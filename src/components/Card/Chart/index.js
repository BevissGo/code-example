import React from 'react'

import './style.scss'

const ChartCard = ({ title, labels, rightItem, chart, leftItem }) => {
  const cardBottom = labels?.items?.map((label) => (
    <div className='card-label' key={label.label}>
      <div className='color' style={{ backgroundColor: label.color }}></div>
      <div className='label'>{label.label}</div>
    </div>
  ))

  return (
    <div className='chart-card__wrapper'>
      <div className='chart-card'>
        <div className='chart-card__header'>
          <div className='header__component'>{leftItem}</div>
          <div className='header__title'>{title}</div>
          <div className='header__component'>{rightItem}</div>
        </div>
        <div className='chart-card__content'>
          <div className='chart__container'>{chart}</div>
        </div>
        <div className={`chart-card__bottom ${labels?.className}`}>{cardBottom}</div>
      </div>
    </div>
  )
}

export default ChartCard
