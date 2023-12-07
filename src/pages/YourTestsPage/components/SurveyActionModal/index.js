import React, { useEffect } from 'react'
import { Button, Form } from 'antd'

import CustomModal from 'components/CustomModal'
import { ACTION_TYPE } from 'pages/YourTestsPage/constants'

import SurveyQuestion from './SurveyQuestion'
import SurveyInformation from './SurveyInformation'

import './style.scss'

function SurveyActionModal({
  type,
  title,
  selectedRecord,
  isOpen,
  createSurveyLoading,
  updateSurveyLoading,
  handleCloseModal,
  handleUpdateSurvey,
  handleCreateSurvey,
}) {
  const [form] = Form.useForm()

  const { surveyName, questions } = selectedRecord

  useEffect(() => {
    if (type === ACTION_TYPE.CREATE) {
      form.resetFields()
      form.setFieldValue('question_list', [{}])
    } else {
      form.setFieldsValue({
        survey_name: surveyName,
        questions: questions?.map((question) => {
          return {
            question: question.question,
            required_answer: question.requiredAnswer,
            type_answer: question.typeAnswer,
          }
        }),
      })
    }
  }, [form, questions, surveyName, type])

  const handleSubmitForm = async (values) => {
    if (type === ACTION_TYPE.CREATE) {
      handleCreateSurvey(values)
    } else {
      handleUpdateSurvey(values)
    }
  }

  return (
    <CustomModal
      className='survey-action-modal'
      title={title}
      isOpen={isOpen}
      whiteBackground={true}
      handleCloseModal={handleCloseModal}
    >
      <Form form={form} colon={false} onFinish={handleSubmitForm}>
        <SurveyInformation />
        <SurveyQuestion type={type} />
        <Button
          loading={createSurveyLoading || updateSurveyLoading}
          className='survey-action-modal__create-survey-btn'
          onClick={() => form.submit()}
        >
          {type === ACTION_TYPE.CREATE ? 'Create survey' : 'Update survey'}
        </Button>
      </Form>
    </CustomModal>
  )
}

export default SurveyActionModal
