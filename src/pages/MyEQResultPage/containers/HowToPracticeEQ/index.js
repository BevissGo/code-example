import React from 'react'

import { EQResultPage as EQResultPageImgs } from 'constants/images'

import './style.scss'

const HowToPracticeEQ = ({rank, contentResult}) => {
  return (
    <div className='how-to-practice-eq'>
      <div className='how-to-practice-eq__title'>
        {contentResult.howToPracticeEQTitle}
      </div>
      <div className='how-to-practice-eq__wrapper'>
        {contentResult.listWayToPracticeEQ.map((way, index) => (
          <div
            key={index}
            className='how-to-practice-eq__wrapper__item'
          >
            <img
              src={EQResultPageImgs[rank][index].src}
              alt={EQResultPageImgs[rank][index].alt}
            />
            <div className='how-to-practice-eq__wrapper__item__title'>
              {way.title}
            </div>
            <div className='how-to-practice-eq__wrapper__item__content'>
              {way.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HowToPracticeEQ
