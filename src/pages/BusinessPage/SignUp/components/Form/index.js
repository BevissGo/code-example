import React from 'react'
import * as Yup from 'yup'
import { FormGroup } from 'reactstrap'
import { useSelector } from 'react-redux'
import { FastField, Form, Formik } from 'formik'

import {
  emailRegExp,
  phoneRegExp,
  websiteRegExp,
} from 'utils'
import ButtonArrow from 'components/Button/Arrow'
import InputField from 'components/CustomField/InputField'

import './style.scss'

const BusinessSignUpForm = (props) => {
  const loadingLogin = useSelector((state) => state.auth.loadingAuth)

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    company_name: '',
    website: '',
  }

  const { contentPage } = props
  const { profile, errors} = contentPage

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(errors.name.required),

    email: Yup.string()
      .required(errors.email.required)
      .email(errors.email.inValid)
      .matches(emailRegExp, errors.email.inValid),

    phone: Yup.string()
      .required(errors.phone.required)
      .matches(phoneRegExp, errors.phone.inValid),

    company_name: Yup.string()
      .required(errors.companyName.required),

    website: Yup.string()
      .matches(websiteRegExp, errors.website.inValid)
      .required(errors.website.required)
  })

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => props.onSubmit(values)}
    >
      {() => {
        return (
          <Form>
            <FastField
              name='name'
              component={InputField}

              label={profile.name[0]}
              placeholder={profile.name[1]}
            />
            <FastField
              name='email'
              component={InputField}

              label={profile.email[0]}
              placeholder={profile.email[1]}
            />
            <FastField
              name='phone'
              component={InputField}

              label={profile.phone[0]}
              placeholder={profile.phone[1]}
            />
            <FastField
              name='company_name'
              component={InputField}

              label={profile.companyName[0]}
              placeholder={profile.companyName[1]}
            />
            <FastField
              name='website'
              component={InputField}

              label={profile.website[0]}
              placeholder={profile.website[1]}
            />
            <FormGroup>
              <ButtonArrow
                businessSignUp
                label={profile.submit}
                type='submit'
                disabled={loadingLogin}
              />
            </FormGroup>
          </Form>
        )
      }}
    </Formik>
  )
}

export default BusinessSignUpForm
