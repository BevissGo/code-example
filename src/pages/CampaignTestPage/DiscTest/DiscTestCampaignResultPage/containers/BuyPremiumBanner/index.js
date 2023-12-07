import React from 'react'
import { FacebookShareButton } from 'react-share'
import { useDispatch } from 'react-redux'
import { updateSharedFacebook } from 'redux/services/profile'

import buyPremium from 'assets/images/BuyResult.png'
import config from 'configs'

import './style.scss'

const BuyPremiumBanner = ({ infoUser, contentContainer }) => {
  const dispatch = useDispatch()
  
  return (
    <div className='buy-premium-banner'>
      <div className='buy-premium-banner__text-section'>
        <h3 className='buy-premium-banner__text-section--title'>{contentContainer.title}</h3>
        <p className='buy-premium-banner__text-section--description'>{contentContainer.description}</p>
        <div className='buy-premium-banner__text-section--button-section'>
          <FacebookShareButton
            onShareWindowClose={() => dispatch(updateSharedFacebook())}
            url={`${config.URIClient}/result/${infoUser._id}`}
          >
            {contentContainer.buttonContent}
          </FacebookShareButton>
        </div>
      </div>
      <div className='buy-premium-banner__image-section'>
        <img alt='disc-buy-premium' className='buy-premium-banner__image-section--image' src={buyPremium} />
      </div>
    </div>
  )
}

export default BuyPremiumBanner
