import React from 'react'
import { useHistory } from 'react-router-dom'
import ScrollAnimation from 'react-animate-on-scroll'

import ButtonArrow from 'components/Button/Arrow'
import Button from 'components/Button/Default'

import { surveyPage } from 'constants/images'

import './style.scss'
import { redirectToWithReplace } from 'utils'

const BrainModalFinish = ({ contentContainer, contentCommon }) => {
  const history = useHistory()
  const {
    finishSurvey: { src: imgFinishSurvey },
  } = surveyPage
  return (
    <div className='brain-modal-finish'>
      <ScrollAnimation
        offset={0}
        animateIn='animate__fadeIn'
        duration={0.75}
        animateOnce={true}
      >
        <div className='brain-modal-finish__header'>
          <div className='brain-modal-finish__header__icon'>
            <img src={imgFinishSurvey} alt='' />
          </div>
          <div className='brain-modal-finish__header__title'>
            {contentContainer.title}!
          </div>
          <div className='brain-modal-finish__header__subscription'>
            {contentContainer.subscription}
          </div>
        </div>
        <div className='brain-modal-finish__footer flex justify-between'>
          <ButtonArrow
            survey
            label={contentCommon.backHome}
            transparent
            onClick={() => redirectToWithReplace(history, '/')}
          />
          <Button
            label={contentCommon.seeResult}
            onClick={() => redirectToWithReplace(history, '/brain-result')}
          />
        </div>
      </ScrollAnimation>
    </div>
  )
}

export default BrainModalFinish
