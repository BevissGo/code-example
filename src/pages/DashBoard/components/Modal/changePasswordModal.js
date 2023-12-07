import React, { useState } from 'react'
import * as Yup from 'yup'
import { Modal } from 'antd'
import { Form, Formik } from 'formik'
import { FormGroup, Label, Input } from 'reactstrap'

import i18nVN from 'i18n/locales/vn'
import ButtonDefault from 'components/Button/Default'
import CloseEyeIcon from 'assets/images/icons/eye.svg'
import WarningIcon from 'assets/images/icons/warning.svg'
import OpenEyeIcon from 'assets/images/icons/open-eye.svg'
import CloseModelIcon from 'assets/images/icons/ic-cancel.svg'

import './style.scss'

const ChangePasswordModal = (props) => {
  const {
    pages: {
      business: { changePassword: contentPage },
    },
  } = i18nVN.src

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const toggleCurrentPasswordVisiblity = () => {
    setShowCurrentPassword(!showCurrentPassword)
  }

  const toggleNewPasswordVisiblity = () => {
    setShowNewPassword(!showNewPassword)
  }

  const toggleConfirmPasswordVisiblity = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required(contentPage.errors.currentPassword.required)
      .min(8, contentPage.errors.currentPassword.min),

    newPassword: Yup.string()
      .required(contentPage.errors.newPassword.required)
      .min(8, contentPage.errors.newPassword.min)
      .when('currentPassword', {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().notOneOf([Yup.ref('currentPassword')], contentPage.errors.newPassword.sameCurrentPassword),
      }),

    confirmPassword: Yup.string()
      .required(contentPage.errors.confirmPassword.required)
      .min(8, contentPage.errors.confirmPassword.min)
      .when('newPassword', {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf([Yup.ref('newPassword')], contentPage.errors.confirmPassword.sameNewPassword),
      }),
  })

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      footer={null}
      width={0}
      style={{ position: 'relative' }}
      className='business-change-password'
    >
      <div className='business-change-password__body'>
        <div className='business-change-password__body__close'>
          <img
            src={CloseModelIcon}
            alt=''
            className='business-change-password__body__close--icon'
            onClick={props.onCancel}
          ></img>
        </div>
        <div className='business-change-password__body__title'>
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
                <FormGroup className='input-field business-change-password__body__input-field'>
                  <Label for='currentPassword'>
                    <p>{contentPage.currentPassword[0]}</p>
                  </Label>
                  <div className='password-field'>
                    <Input
                      id='currentPassword'
                      name='currentPassword'
                      value={values.currentPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder={contentPage.currentPassword[1]}
                      invalid={errors.currentPassword && touched.currentPassword}
                    />
                    <img
                      src={showCurrentPassword ? OpenEyeIcon : CloseEyeIcon}
                      alt=''
                      className='password-eye'
                      onClick={toggleCurrentPasswordVisiblity}
                    ></img>
                  </div>
                  {errors['currentPassword'] && (
                    <div className='password-error'>
                      <span>
                        <img src={WarningIcon} alt='' />
                      </span>
                      <div className='invalid-feedback'>{errors['currentPassword']}</div>
                    </div>
                  )}
                </FormGroup>
                <FormGroup className='input-field business-change-password__body__input-field'>
                  <Label for='newPassword'>
                    <p>{contentPage.newPassword[0]}</p>
                  </Label>
                  <div className='password-field'>
                    <Input
                      id='newPassword'
                      name='newPassword'
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder={contentPage.newPassword[1]}
                      invalid={errors.newPassword && touched.newPassword}
                    />
                    <img
                      src={showNewPassword ? OpenEyeIcon : CloseEyeIcon}
                      alt=''
                      className='password-eye'
                      onClick={toggleNewPasswordVisiblity}
                    ></img>
                  </div>
                  {errors['newPassword'] && (
                    <div className='password-error'>
                      <span>
                        <img src={WarningIcon} alt='' />
                      </span>
                      <div className='invalid-feedback'>{errors['newPassword']}</div>
                    </div>
                  )}
                </FormGroup>
                <FormGroup className='input-field business-change-password__body__input-field'>
                  <Label for='confirmPassword'>
                    <p>{contentPage.confirmPassword[0]}</p>
                  </Label>
                  <div className='password-field'>
                    <Input
                      id='confirmPassword'
                      name='confirmPassword'
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={contentPage.confirmPassword[1]}
                      invalid={errors.confirmPassword && touched.confirmPassword}
                    />
                    <img
                      src={showConfirmPassword ? OpenEyeIcon : CloseEyeIcon}
                      alt=''
                      className='password-eye'
                      onClick={toggleConfirmPasswordVisiblity}
                    ></img>
                  </div>
                  {errors['confirmPassword'] && (
                    <div className='password-error'>
                      <span>
                        <img src={WarningIcon} alt='' />
                      </span>
                      <div className='invalid-feedback'>{errors['confirmPassword']}</div>
                    </div>
                  )}
                </FormGroup>
                <div className='business-change-password__footer'>
                  <FormGroup className='business-change-password__footer--buttons'>
                    <ButtonDefault
                      label={contentPage.footer.cancel}
                      onClick={props.onCancel}
                      extraClassName='business-button--cancel'
                    />
                    <ButtonDefault
                      type='submit'
                      label={contentPage.footer.saveChange}
                      extraClassName='business-button--save'
                    />
                  </FormGroup>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </Modal>
  )
}

export default ChangePasswordModal
