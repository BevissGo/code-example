import React from 'react'

import './style.scss'

const RoundedScore = ({ score, maxScore }) => {
  return (
    <div className='rounded-score__container'>
      <div className='rounded-score'>
        <div className='rounded-score__inner'>
          <div className='score'>{score}</div>
          <div className='max-score'>/{maxScore}</div>
        </div>
      </div>
    </div>
  )
}

export default RoundedScore