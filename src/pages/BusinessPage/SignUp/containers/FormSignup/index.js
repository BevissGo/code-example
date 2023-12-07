import React from 'react'

import i18nVN from 'i18n/locales/vn'

import './style.scss'
import BusinessSignUpForm from '../../components/Form'

const FormSignUp = ({ handleSubmit }) => {
  const {
    pages: { business: { signUp: contentPage } }
  } = i18nVN.src

  return (
    <div className='business-form-signup'>
      <div className='business-form-signup__background'>
        <div className='business-form-signup__overview'>
          <p className='business-form-signup__overview__title'>
            {contentPage.overview}
          </p>
          <div className='business-form-signup__overview__description'>
            <p>{contentPage.description.title}</p>
            <ul>
              {contentPage.description.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
            </ul>
          </div>
        </div>
        <div className='business-form-signup__form'>
          <p className='business-form-signup__form--title'>{contentPage.profile.signUp}</p>
          <BusinessSignUpForm
            onSubmit={handleSubmit}
            contentPage={contentPage}
          />
        </div>
      </div>
    </div>
  )
}

export default FormSignUp
