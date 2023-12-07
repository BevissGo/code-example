import React from 'react'
import './style.scss'

const EQScore = ({ rank, score }) => {
  return (
    <div className={`my-eq-result__eq-score__container ${rank}`}>
      <div>
        <span className='my-eq-result__eq-score__current'>
          {score < 10 ? '0' + score : score}
        </span>
        <hr className='my-eq-result__eq-score__line' />
        <span className='my-eq-result__eq-score__total'>64</span>
      </div>
    </div>
  )
}

export default EQScore
