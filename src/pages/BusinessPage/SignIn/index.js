import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import i18nVN from 'i18n/locales/vn'
import Footer from 'components/FooterPageV2'
import Background from 'components/Background'
import TemplatePage from 'containers/TemplatePage'
import CheckEmailModal from 'components/CheckEmailModal'
import { resetPasswordBusiness, signInBusiness } from 'redux/services/auth'
import FormSignIn from './components/form'
import EnterEmailModal from './components/modal'

import './style.scss'

const BusinessSignInPage = () => {
  const {
    pages: {
      business: {
        signIn: { checkEmail: contentPage },
      },
    },
  } = i18nVN.src

  const location = useLocation()
  const dispatch = useDispatch()

  const [showEnterEmailModal, setShowEnterEmailModal] = useState(false)
  const [showCheckEmailModal, setShowCheckEmailModal] = useState(false)

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const isBusinessAuthenticated = useSelector((state) => state.auth.isBusinessAuthenticated)

  if (isAuthenticated) {
    return <Redirect to={(location.state && location.state.from.pathname) || '/'} />
  } else if (isBusinessAuthenticated) {
    return <Redirect to='/business' />
  }

  const handleSubmit = (values) => {
    dispatch(signInBusiness(values))
  }

  const handleShowEnterEmailModal = () => {
    setShowEnterEmailModal(!showEnterEmailModal)
  }
  const handleShowCheckEmailModal = () => {
    setShowCheckEmailModal(!showCheckEmailModal)
  }

  const handleEnterEmailModal = (e) => {
    setShowEnterEmailModal(!showEnterEmailModal)
    dispatch(resetPasswordBusiness(e.email, handleShowCheckEmailModal))
  }

  return (
    <>
      <TemplatePage namePage='business-signin'>
        <Background signup />
        <div className='business-signin__form'>
          <div className='business-signin__form__background'>
            <FormSignIn onSubmit={handleSubmit} handleShowEnterEmailModal={handleShowEnterEmailModal} />
          </div>
        </div>
        <Footer />
      </TemplatePage>
      <EnterEmailModal
        show={showEnterEmailModal}
        onSubmit={handleEnterEmailModal}
        handleCloseModal={handleShowEnterEmailModal}
      />
      <CheckEmailModal show={showCheckEmailModal} content={contentPage} />
    </>
  )
}

export default BusinessSignInPage
