import React from 'react'
import * as Yup from 'yup'
import { FormGroup } from 'reactstrap'
import { FastField, Form, Formik } from 'formik'

import { emailRegExp } from 'utils'
import i18nVN from 'i18n/locales/vn'
import ButtonDefault from 'components/Button/Default'
import InputField from 'components/CustomField/InputField'

import './style.scss'

const EnterEmailModal = ({ show, onSubmit, handleCloseModal }) => {
  const initialValues = { email: '' }

  const {
    pages: { business: { signIn: { form: contentPage }}}
  } = i18nVN.src

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(contentPage.errors.email.required)
      .email(contentPage.errors.email.inValid)
      .matches(emailRegExp, contentPage.errors.email.inValid)
  })

  return show && (
    <div className='enter-email-modal'>
      <div className='enter-email-modal-wrap'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
        {() => {
          return (
            <Form>
              <FastField
              name='email'
              component={InputField}

              label={contentPage.modal.title}
              placeholder={contentPage.modal.placeholder}
              />
              <div className='enter-email-modal__footer'>
                <FormGroup>
                  <ButtonDefault
                    label={contentPage.modal.cancel}
                    onClick={handleCloseModal}
                    extraClassName='business-signup-modal-btn'
                  />
                </FormGroup>
                <FormGroup>
                  <ButtonDefault
                    label={contentPage.modal.submit}
                    extraClassName='business-signup-modal-btn'
                    type='submit'
                  />
                </FormGroup>
              </div>
            </Form>
          )
        }}
        </Formik>
      </div>
    </div>
  )
}

export default EnterEmailModal
