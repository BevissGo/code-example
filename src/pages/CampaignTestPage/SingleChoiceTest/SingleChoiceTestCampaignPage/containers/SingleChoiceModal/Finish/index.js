import React from 'react'
import { useHistory } from 'react-router-dom'
import ScrollAnimation from 'react-animate-on-scroll'

import ButtonArrow from 'components/Button/Arrow'
import Button from 'components/Button/Default'

import { redirectToWithReplace } from 'utils'

import { surveyPage } from 'constants/images'

import './style.scss'

const SingleChoiceModalFinish = ({ contentContainer, contentCommon, campaignId, positionId }) => {
  const history = useHistory()
  const {
    finishSurvey: { src: imgFinishSurvey },
  } = surveyPage
  return (
    <div className='eq-modal-finish'>
      <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
        <div className='eq-modal-finish__header'>
          <div className='eq-modal-finish__header__icon'>
            <img src={imgFinishSurvey} alt='' />
          </div>
          <div className='eq-modal-finish__header__title'>{contentContainer.title}!</div>
          <div className='eq-modal-finish__header__subscription'>
            Chúc mừng bạn đã hoàn thành bài kiểm tra trắc nghiệm. Các thông tin của bạn trong bài khảo sát được cam kết
            bảo mật và đảm bảo thông tin cho người dùng.
          </div>
        </div>
        <div className='eq-modal-finish__footer flex justify-between'>
          <ButtonArrow
            survey
            label={contentCommon.backHome}
            transparent
            onClick={() => redirectToWithReplace(history, '/')}
          />
          <Button
            label={contentCommon.seeResult}
            onClick={() =>
              redirectToWithReplace(history, `/single-choice-test-campaign-result/${campaignId}/${positionId}`)
            }
          />
        </div>
      </ScrollAnimation>
    </div>
  )
}

export default SingleChoiceModalFinish
