import React, { useEffect } from 'react'
import { Button, Form } from 'antd'

import CustomModal from 'components/CustomModal'
import { toastifyNotify } from 'helpers'
import { ACTION_TYPE } from 'pages/YourTestsPage/constants'

import McqQuestion from './McqQuestion'
import CustomTestInformation from './CustomTestInformation'

import './style.scss'

function CustomTestActionModal({
  type,
  title,
  selectedRecord,
  isOpen,
  createCustomTestLoading,
  updateCustomTestLoading,
  handleCloseModal,
  handleUpdateCustomTest,
  handleCreateCustomTest,
}) {
  const [form] = Form.useForm()

  const { testName, durationTime, description, questionList } = selectedRecord

  useEffect(() => {
    if (type === ACTION_TYPE.CREATE) {
      form.resetFields()
      form.setFieldValue('question_list', [{ answer_list: [{ answer: '', is_correct: false }], question: '' }])
    } else {
      form.setFieldsValue({
        test_name: testName,
        duration: durationTime ? 'limited' : 'unlimited',
        duration_time: durationTime,
        description: description,
        question_list: questionList?.map((question) => {
          return {
            question: question.question,
            answer_list: question.answerList.map((answer) => {
              return {
                answer: answer.answer,
                is_correct: answer.isCorrect,
              }
            }),
          }
        }),
      })
    }
  }, [description, durationTime, form, questionList, testName, type])

  const handleSubmitForm = async (values) => {
    const { question_list: questionList } = values
    let validatedValue = true

    if (!questionList) {
      toastifyNotify('error', 'Please add question')
    } else {
      for (let item = 0; item < questionList?.length; item++) {
        const answerList = questionList[item].answer_list
        let haveCorrect = false

        for (let i of answerList) {
          if (i.is_correct === true) {
            haveCorrect = true
            break
          }
        }

        if (haveCorrect) {
          continue
        }

        validatedValue = false
        toastifyNotify('error', `Please select answer for question ${item + 1}`)
      }

      if (!validatedValue) {
        return
      }

      if (type === ACTION_TYPE.CREATE) {
        handleCreateCustomTest(values)
      } else {
        handleUpdateCustomTest(values)
      }
    }
  }

  return (
    <CustomModal
      className='custom-test-action-modal'
      title={title}
      isOpen={isOpen}
      whiteBackground={true}
      handleCloseModal={handleCloseModal}
    >
      <Form form={form} colon={false} onFinish={handleSubmitForm}>
        <CustomTestInformation type={type} durationTime={durationTime} />
        <McqQuestion type={type} form={form} />
        <Button
          loading={createCustomTestLoading || updateCustomTestLoading}
          className='custom-test-action-modal__create-test-btn'
          onClick={() => form.submit()}
        >
          {type === ACTION_TYPE.CREATE ? 'Create test' : 'Update test'}
        </Button>
      </Form>
    </CustomModal>
  )
}

export default CustomTestActionModal
