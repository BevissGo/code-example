import React from 'react'

import './style.scss'

function ChartWrapper({ title, children, style }) {
  return (
    <div className='chart-wrapper' style={style}>
      <h1 className='chart-wrapper__header'>{title}</h1>
      {children}
    </div>
  )
}

export default ChartWrapper
