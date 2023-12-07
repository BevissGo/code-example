import React from 'react'

import './style.scss'

const ProgressBar = ({ step, amountPageSurvey }) => {
  const percentWidth = (step / amountPageSurvey) * 100
  return (
    <div className='progress-bar'>
      <div style={{ width: `${percentWidth}%` }} className='progress-bar__bar'></div>
    </div>
  )
}

export default ProgressBar
