import React from 'react'
import * as Yup from 'yup'
import { FormGroup } from 'reactstrap'
import { FastField, Form, Formik } from 'formik'

import ButtonDefault from 'components/Button/Default'
import InputField from 'components/CustomField/InputField'

import './style.scss'

const ExtraQuestionModal = ({ show, onSubmit, position }) => {
  const initialValues = { answerExtraQuestion: Array(position?.extra_question?.length).fill('') }

  const validationSchema = Yup.object().shape({
    answerExtraQuestion: Yup.array().of(Yup.string().required('Answer is required')),
  })

  return (
    show && (
      <div className='modal'>
        <div className='modal-wrap'>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            <Form>
              {position?.extra_question?.map((question, index) => {
                return (
                  <FastField
                    key={question}
                    type='textarea'
                    component={InputField}
                    name={`answerExtraQuestion.${index}`}
                    extraClass='extraQuestion'
                    label={question}
                    placeholder='Trả lời câu hỏi ...'
                  />
                )
              })}
              <div className='modal__footer'>
                <FormGroup>
                  <ButtonDefault label='Tiếp tục' type='submit' />
                </FormGroup>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    )
  )
}

export default ExtraQuestionModal
