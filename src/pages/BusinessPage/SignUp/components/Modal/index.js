import React from 'react'

import i18nVN from 'i18n/locales/vn'
import ButtonDefault from 'components/Button/Default'
import emailCheck from 'assets/images/icons/email-check.svg'

import './style.scss'

const Modal = () => {
  const {
    pages: { business: { signUp: { popUp: contentPage } } }
  } = i18nVN.src

  return (
    <>
      <div className='business-signup-modal__background'></div>
      <div className='business-signup-modal'>
        <div className='business-signup-modal__body'>
          <div>
            <img src={emailCheck} alt='' />
          </div>
          <div>
            <p>{contentPage.content}</p>
          </div>
          <div>
            <a href='/business/sign-in' alt=''>
              <ButtonDefault
                label={contentPage.confirm}
                extraClassName='business-signup-modal-btn'
              />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
