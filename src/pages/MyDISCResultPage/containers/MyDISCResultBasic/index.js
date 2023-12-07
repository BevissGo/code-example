import React from 'react'
import { useSelector } from 'react-redux'
import ScrollAnimation from 'react-animate-on-scroll'

import Button from 'components/Button/Default'
import lock from 'assets/images/icons/lock.png'
import i18nPremiumVN from 'i18n/locales/vn.js'

import './style.scss'

const MyDISCResultBasic = ({ handleShowShareModal }) => {
  const profilePattern = useSelector((state) => state.report.profilePattern)
  const profile = useSelector((state) => state.profile.profile)

  const {
    pages: {
      result: {
        resultBasic: { title, btnShare },
      },
    },
  } = i18nPremiumVN.src

  const listDescriptionCharacter = profilePattern.overview || []

  return (
    <>
      <div
        className='my-disc-result-basic'
        style={{
          paddingBottom: profile?.shared_facebook ? '20px' : '30px',
        }}
      >
        <div
          className='my-disc-result-basic__overview'
          style={{
            paddingBottom: profile?.shared_facebook ? 0 : '30px',
          }}
        >
          <p className='my-disc-result-basic__overview__title'>{title}</p>
          <div
            className='my-disc-result-basic__overview__body'
            style={{
              marginBottom: profile?.shared_facebook ? 0 : '40px',
            }}
          >
            <ScrollAnimation
              style={{ '-webkit-text-fill-color': profile?.shared_facebook ? 'inherit' : 'transparent' }}
              offset={0}
              animateIn='animate__fadeInUp'
              duration={0.75}
              animateOnce={true}
            >
              <span>{listDescriptionCharacter[0]}</span>
              {profile?.shared_facebook && (
                <>
                  <span>{listDescriptionCharacter[1]}</span>
                  <span>{listDescriptionCharacter[2]}</span>
                </>
              )}
            </ScrollAnimation>
          </div>
          {!profile?.shared_facebook && (
            <div className='my-disc-result-basic__overview__summary'>
              <div className='flex justify-center'>
                <ScrollAnimation offset={0} animateIn='animate__fadeInUp' duration={0.75} animateOnce={true}>
                  <Button label={btnShare.toUpperCase()} onClick={handleShowShareModal} icon={lock} />
                </ScrollAnimation>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MyDISCResultBasic
