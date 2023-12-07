import ScrollAnimation from 'react-animate-on-scroll'
import React from 'react'
import { FacebookShareButton } from 'react-share'
import { useDispatch } from 'react-redux'
import { updateSharedFacebook } from 'redux/services/profile'

import config from 'configs'
import { copyToClipboard } from 'utils'

import FacebookLogo from 'assets/images/icons/facebook-circle-logo.svg'

import './style.scss'

const SharingResult = ({ infoUser, contentContainer }) => {
  const urlSharingResult = `${config.URIClient}/result/${infoUser._id || ''}`
  const dispatch = useDispatch()

  return (
    <div className='sharing-result'>
      <div className='sharing-result__background'>
        <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
          <p className='sharing-result__title'>{contentContainer.title}</p>
        </ScrollAnimation>
        <div className='sharing-result--copy-link'>
          <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
            <div className='sharing-result--copy-link__container'>
              <p>{urlSharingResult}</p>
              <button onClick={() => copyToClipboard(`${config.URIClient}/result/${infoUser._id}`)}>Copy</button>
            </div>
          </ScrollAnimation>
        </div>
        <div className='sharing-result__or'>
          <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
            <span>Hoặc</span>
          </ScrollAnimation>
          <div className='line'></div>
        </div>
        <div className='sharing-result--social'>
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

export default SharingResult
