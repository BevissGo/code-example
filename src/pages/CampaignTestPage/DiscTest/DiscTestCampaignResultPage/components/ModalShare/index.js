import React from 'react'
import { FacebookShareButton } from 'react-share'
import { useDispatch } from 'react-redux'
import { updateSharedFacebook } from 'redux/services/profile'
import shareLink from 'assets/images/share-link.png'
import facebookLogo from 'assets/images/icons/facebook-circle-logo.svg'
import CancelIcon from 'assets/images/icons/CancelIcon.png'

import i18nVN from 'i18n/locales/vn'
import config from 'configs'

import './style.scss'

const ModalShare = ({ handleShowShareModal, infoUser }) => {
  const {
    pages: {
      result: {
        resultBasic: {
          shareModal: { title, description, footer },
        },
      },
    },
  } = i18nVN.src
  const dispatch = useDispatch()

  return (
    <>
      <div className='modal-share__background'></div>
      <div className='modal-share'>
        <div className='modal-share__modal'>
          <div className='modal-share__modal__background'>
            <div className='modal-share__modal__close' onClick={handleShowShareModal}>
              <img src={CancelIcon} alt='Close'></img>
            </div>
            <div className='modal-share__modal__body'>
              <div className='modal-share__modal__body__left'>
                <div className='modal-share__modal__body__left__header'>{title}</div>
                <div className='modal-share__modal__body__left__body'>
                  <span>{description}</span>
                </div>
                <div className='modal-share__modal__body__left__footer'>
                  <div className='font-bold'>{footer}</div>
                  <FacebookShareButton
                    onShareWindowClose={() => dispatch(updateSharedFacebook())}
                    url={`${config.URIClient}/result/${infoUser._id}`}
                  >
                    {' '}
                    <img src={facebookLogo} alt='fbLogo'></img>
                  </FacebookShareButton>
                </div>
              </div>
              <div className='modal-share__modal__body__right'>
                <img src={shareLink} alt=''></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalShare
