import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'

import { brainResultPage } from 'constants/images'

import './style.scss'

const SideOfBrain = ({ side, sideOfBrain, subscription, contentCommon, totalTime  }) => {
  return (
    <div>
      <div className='my-brain-result__side-of-brain'>
        <div className='my-brain-result__side-of-brain__background'>
          <div className='my-brain-result__side-of-brain__icon left col-12 col-mid-lg-6'>
            <ScrollAnimation
              offset={0}
              animateIn='animate__fadeInLeft'
              duration={0.75}
              animateOnce={true}
            >
              <img src={brainResultPage[side]?.sideOfBrain.src} alt='' />
            </ScrollAnimation>
          </div>
          <div className='my-brain-result__side-of-brain__content col-12 col-mid-lg-6'>
            <ScrollAnimation
              offset={0}
              animateIn='animate__fadeInUp'
              duration={0.75}
              animateOnce={true}
            >
              <p className='my-brain-result__side-of-brain__content__description'>
                {contentCommon.yourResult} {totalTime}
                <br />
                <b className='my-brain-result__side-of-brain__content__title'>
                  {sideOfBrain}
                </b>
                <br />
                <br />
                {subscription}
                <br />
                {contentCommon.subscription}
              </p>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SideOfBrain
