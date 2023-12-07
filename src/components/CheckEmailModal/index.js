import React from 'react'

import ButtonDefault from 'components/Button/Default'
import emailCheck from 'assets/images/icons/email-check.svg'

import './style.scss'

const CheckEmailModal = ({ show, content }) => {
  return (
    show && (
      <>
        <div className='check-email-modal__background'></div>
        <div className='check-email-modal'>
          <div className='check-email-modal__body'>
            <div>
              <img src={emailCheck} alt='' />
            </div>
            <div>
              <p>{content.content}</p>
            </div>
            <div>
              <a href='/business/sign-in' alt=''>
                <ButtonDefault
                  label={content.confirm}
                  extraClassName='business-signup-modal-btn'
                />
              </a>
            </div>
          </div>
        </div>
      </>
    )
  )
}

export default CheckEmailModal
