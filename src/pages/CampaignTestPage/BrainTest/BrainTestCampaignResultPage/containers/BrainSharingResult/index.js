import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import { FacebookShareButton } from 'react-share'
import { useDispatch } from 'react-redux'
import { updateSharedFacebook } from 'redux/services/profile'

import config from 'configs'
import { copyToClipboard } from 'utils'

import FacebookLogo from 'assets/images/icons/facebook-circle-logo.svg'

import './style.scss'

const BrainSharingResult = ({ infoUser, contentContainer }) => {
  const urlSharingResult = `${config.URIClient}/result/${infoUser._id || ''}`
  const dispatch = useDispatch()

  return (
    <div className='brain-sharing-result'>
      <div className='brain-sharing-result__background'>
        <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
          <p className='brain-sharing-result__title'>{contentContainer.title}</p>
        </ScrollAnimation>
        <div className='brain-sharing-result--copy-link'>
          <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
            <div className='brain-sharing-result--copy-link__container'>
              <p>{urlSharingResult}</p>
              <button onClick={() => copyToClipboard(`${config.URIClient}/result/${infoUser._id}/#brain-result`)}>
                Copy
              </button>
            </div>
          </ScrollAnimation>
        </div>
        <div className='brain-sharing-result__or'>
          <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
            <span>Hoặc</span>
          </ScrollAnimation>
          <div className='line'></div>
        </div>
        <div className='brain-sharing-result--social'>
          <FacebookShareButton
            onShareWindowClose={() => dispatch(updateSharedFacebook())}
            url={`${config.URIClient}/result/${infoUser._id}`}
          >
            <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
              <img src={FacebookLogo} alt='' />
            </ScrollAnimation>
          </FacebookShareButton>
        </div>
      </div>
    </div>
  )
}

export default BrainSharingResult
