import React from 'react'
import { useSelector } from 'react-redux'
import ScrollAnimation from 'react-animate-on-scroll'

import choiceicon from 'assets/images/backgrounds/ChoiceIcon.png'
import Content from './content'

import './style.scss'

const SectionCallTest = ({ contentCallTest }) => {
  const isBusinessAuthenticated = useSelector(
    (state) => state.auth.isBusinessAuthenticated
  )

  return (
    <div className='section-call-test'>
      <div className='call-test-disc'>
        <ScrollAnimation
          offset={0}
          duration={0.75}
          animateOnce={true}
          animateIn='animate__fadeInLeft'
        >
          <div className='process-disc__container'>
            <div className='process-disc__left'>
              <Content
                href={'/survey'}
                content={contentCallTest.testDISC}
                showButton={!isBusinessAuthenticated}
              />
            </div>
            <div className='process-disc__right'>
              <Content
                href={'/iq-test'}
                showButton={!isBusinessAuthenticated}
                content={contentCallTest.testIQ}
              />
            </div>
          </div>
        </ScrollAnimation>
      </div>
      <div className='img-choiceicon'>
        <img alt='' src={choiceicon} />
      </div>
    </div>
  )
}

export default SectionCallTest
