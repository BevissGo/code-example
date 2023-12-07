import React, { useState } from 'react'
import * as Yup from 'yup'
import { FastField, Form, Formik } from 'formik'
import { FormGroup, Label, Input } from 'reactstrap'

import i18nVN from 'i18n/locales/vn'
import ButtonArrow from 'components/Button/Arrow'
import InputField from 'components/CustomField/InputField'
import CloseEyeIcon from 'assets/images/icons/eye.svg'
import WarningIcon from 'assets/images/icons/warning.svg'
import OpenEyeIcon from 'assets/images/icons/open-eye.svg'

import './style.scss'

const BusinessSignInForm = (props) => {
  const {
    pages: {
      business: {
        signIn: { form: contentPage },
      },
    },
  } = i18nVN.src

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisiblity = () => {
    setShowPassword(!showPassword)
  }

  const initialValues = {
    email: '',
    password: '',
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().required(contentPage.errors.email.required).email(contentPage.errors.email.inValid),

    password: Yup.string().required(contentPage.errors.password.required).min(8, contentPage.errors.password.min),
  })

  return (
    <div className='business-form-signin'>
      <div className='business-form-signin__title'>
        <p>{contentPage.title}</p>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => props.onSubmit(values)}
      >
        {(formikProps) => {
          const { values, errors, touched, handleChange, handleBlur } = formikProps
          return (
            <Form>
              <FastField
                name='email'
                component={InputField}
                label={contentPage.email[0]}
                placeholder={contentPage.email[1]}
              />
              <FormGroup className='input-field'>
                <Label for='password'>
                  <p>{contentPage.password[0]}</p>
                </Label>
                <div className='password-field'>
                  <Input
                    id='password'
                    name='password'
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={contentPage.password[1]}
                    invalid={errors.password && touched.password}
                  />
                  <img
                    src={showPassword ? OpenEyeIcon : CloseEyeIcon}
                    alt=''
                    className='password-eye'
                    onClick={togglePasswordVisiblity}
                  ></img>
                </div>
                {errors['password'] && (
                  <div className='password-error'>
                    <span>
                      <img src={WarningIcon} alt='' />
                    </span>
                    <div className='invalid-feedback'>{errors['password']}</div>
                  </div>
                )}
              </FormGroup>
              <div className='business-form-signin__footer'>
                <FormGroup>
                  <ButtonArrow businessSignUp label={contentPage.signIn} type='submit' />
                </FormGroup>
                <div className='business-form-signin__footer--password'>
                  <p onClick={props.handleShowEnterEmailModal}>{contentPage.forgetPassword}</p>
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default BusinessSignInForm
