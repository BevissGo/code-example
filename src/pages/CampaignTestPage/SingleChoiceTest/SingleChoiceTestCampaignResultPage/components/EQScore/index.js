import React from 'react'
import './style.scss'

const EQScore = ({ rank, score }) => {
  return (
    <div className={`eq-score__container ${rank}`}>
      <div>
        <span className='eq-score__current'>
          {score < 10 ? '0' + score : score}
        </span>
        <hr className='eq-score__line' />
        <span className='eq-score__total'>64</span>
      </div>
    </div>
  )
}

export default EQScore
