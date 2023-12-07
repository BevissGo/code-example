import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { redirectToWithPush } from 'utils'
import Background from 'assets/images/backgrounds/do-test-disc.png'

import CreateTestCard from './components/CreateTestCard'

import './style.scss'

const SectionCallTest = () => {
  const history = useHistory()

  const handleRedirect = useCallback(
    (pathname) => {
      redirectToWithPush(history, pathname)
    },
    [history],
  )

  return (
    <div className='section-call-test-v2'>
      <img className='section-call-test-v2__background' src={Background} alt='do-test-disc' />
      <div className='section-call-test-v2__container'>
        <div className='section-call-test-v2__temp-space'></div>
        <div className='section-call-test-v2__main'>
          <div className='section-call-test-v2__title-container'>
            <p className='section-call-test-v2__title'>Làm bài test ngay bây giờ</p>
            <p className='section-call-test-v2__desc'>Và cùng tìm tìm hiểu con người thật của bạn!</p>
          </div>
          <div className='section-call-test-v2__actions'>
            <div className='section-call-test-v2__action-container'>
              <CreateTestCard label='Trắc nghiệm EQ' success onClick={() => handleRedirect('/eq-test')} />
            </div>
            <div className='section-call-test-v2__action-container'>
              <CreateTestCard label='Trắc nghiệm IQ' primary onClick={() => handleRedirect('/iq-test')} />
            </div>
            <div className='section-call-test-v2__action-container'>
              <CreateTestCard
                label='Trắc nghiệm não bộ'
                onClick={() => handleRedirect('/left-right-brain-test')}
                warning
              />
            </div>
            <div className='section-call-test-v2__action-container'>
              <CreateTestCard label='Trắc nghiệm DiSC' danger onClick={() => handleRedirect('/survey')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionCallTest
