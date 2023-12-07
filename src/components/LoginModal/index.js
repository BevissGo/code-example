import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { getValueFromStorage } from 'utils'
import CancelIcon from 'assets/images/icons/CancelIcon.png'
import { fetchProfileIfNeeded } from 'redux/services/profile'
import Step from './containers/Step'

import './style.scss'

const LoginModal = ({
  requiredStep,
  isAuthenticated,
  onOpenLoginModal,
}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated) {
      getValueFromStorage('access-token') && dispatch(fetchProfileIfNeeded())
    }
  }, [isAuthenticated, dispatch])

  if (!requiredStep) {
    return null
  }

  return (
    <>
      <div className='login-modal__background'></div>
      <div className='login-modal'>
        <div className='login-modal__modal'>
          <div className='login-modal__modal__background'>
            <div
              className='login-modal__modal__close'
              onClick={onOpenLoginModal}
            >
              <img src={CancelIcon} alt='Close'></img>
            </div>
            <div className='login-modal__modal__body'>
              <Step
                title={requiredStep?.title}
                imgSrc={requiredStep?.imgSrc}
                action={requiredStep?.action}
                description={requiredStep?.description}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginModal
