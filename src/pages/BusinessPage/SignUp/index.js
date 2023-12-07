import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import Footer from 'components/FooterPageV2'
import Background from 'components/Background'
import TemplatePage from 'containers/TemplatePage'
import { signUpBusiness } from 'redux/services/auth'
import Modal from 'pages/BusinessPage/SignUp/components/Modal'

import FormSignUp from './containers/FormSignup'

import './style.scss'

const BusinessSignUpPage = () => {
  const [isShowModal, setIsShowModal] = useState(false)
  const dispatch = useDispatch()

  const handleShowModal = () => {
    setIsShowModal(!isShowModal)
  }

  const handleSubmit = (values) => {
    dispatch(signUpBusiness(values, handleShowModal))
  }

  return (
    <>
      <TemplatePage namePage='business-signup'>
        <Background signup />
        <FormSignUp handleSubmit={handleSubmit} />
        <Footer />
      </TemplatePage>
      {isShowModal && (
        <Modal />
      )}
    </>
  )
}

export default BusinessSignUpPage
