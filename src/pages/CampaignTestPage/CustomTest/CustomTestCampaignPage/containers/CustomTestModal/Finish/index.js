import React from 'react'
import { useHistory } from 'react-router-dom'
import ScrollAnimation from 'react-animate-on-scroll'

import ButtonArrow from 'components/Button/Arrow'
import Button from 'components/Button/Default'

import { redirectToWithReplace } from 'utils'

import { surveyPage } from 'constants/images'

import './style.scss'

const CustomTestModalFinish = ({ contentContainer, contentCommon, campaignId, positionId, testId }) => {
  const history = useHistory()
  const {
    finishSurvey: { src: imgFinishSurvey },
  } = surveyPage
  return (
    <div className='custom-test-modal-finish'>
      <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
        <div className='custom-test-modal-finish__header'>
          <div className='custom-test-modal-finish__header__icon'>
            <img src={imgFinishSurvey} alt='' />
          </div>
          <div className='custom-test-modal-finish__header__title'>{contentContainer.title}!</div>
          <div className='custom-test-modal-finish__header__subscription'>
            Chúc mừng bạn đã hoàn thành bài kiểm tra trắc nghiệm. Các thông tin của bạn trong bài khảo sát được cam kết
            bảo mật và đảm bảo thông tin cho người dùng.
          </div>
        </div>
        <div className='custom-test-modal-finish__footer flex justify-between'>
          <ButtonArrow
            survey
            label={contentCommon.backHome}
            transparent
            onClick={() => redirectToWithReplace(history, '/')}
          />
          <Button
            label={contentCommon.seeResult}
            onClick={() =>
              redirectToWithReplace(history, `/custom-test-campaign-result/${campaignId}/${positionId}/${testId}`)
            }
          />
        </div>
      </ScrollAnimation>
    </div>
  )
}

export default CustomTestModalFinish
