import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'antd'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import CustomInput from 'components/CustomInput'
import CustomRadio from 'components/CustomRadio'

import './style.scss'

function McqAnswer({ form, question, questionIndex }) {
  const questionList = form.getFieldValue('question_list')
  const answerValues = questionList?.[questionIndex]?.['answer_list']
  const correctCheck = (answerValues ?? []).map((answer) => answer?.is_correct ?? false)
  const [answerCheck, setAnswerCheck] = useState(correctCheck ?? [])

  const handleAnswerCorrect = (e, answerName, questionIndex) => {
    const questionList = form.getFieldValue('question_list')
    const answerValues = questionList[questionIndex]['answer_list']

    if (e.target.checked) {
      const [changeAnswerCheck, newAnswer] = answerValues?.reduce(
        (acc, answer, index) => {
          const isCorrect = index === answerName

          acc[0].push(isCorrect)
          acc[1].push({
            ...answer,
            is_correct: isCorrect,
          })

          return acc
        },
        [[], []],
      )

      setAnswerCheck(changeAnswerCheck)

      const newQuestionList = questionList?.map((question, index) => {
        if (index === questionIndex) {
          return {
            ...question,
            answer_list: newAnswer,
          }
        }
        return question
      })

      form.setFieldsValue({ question_list: newQuestionList })
    } else {
      const changeAnswerCheck = answerValues?.map(() => false)
      setAnswerCheck(changeAnswerCheck)
    }
  }

  return (
    <div className='mcq-answer'>
      <Form.List name={[question.name, 'answer_list']}>
        {(answers, { add: addAnswer, remove: removeAnswer }) => (
          <>
            {answers.map((answer, answerIndex) => (
              <div key={answer.key}>
                <p className='mcq-answer__answer-index'>Answer {answerIndex + 1}</p>
                <Row>
                  <Col span={19}>
                    <Form.Item
                      {...answer}
                      name={[answer.name, 'answer']}
                      rules={[
                        {
                          required: true,
                          message: 'Please fill the answer',
                        },
                      ]}
                    >
                      <CustomInput />
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <div className='mcq-answer__radio-group'>
                      <Form.Item
                        {...answer}
                        name={[answer.name, 'is_correct']}
                        valuePropName='checked'
                        initialValue={false}
                      >
                        <CustomRadio
                          checked={answerCheck[answerIndex] ?? false}
                          onChange={(e) => handleAnswerCorrect(e, answer.name, questionIndex)}
                        />
                      </Form.Item>
                      <span className='mcq-answer__correct-answer'>Correct answer</span>
                    </div>
                  </Col>

                  {answers.length > 1 && (
                    <Col span={1}>
                      <Button
                        style={{ height: 36, width: 36 }}
                        className='mcq-answer__remove-answer-btn'
                        onClick={() => removeAnswer(answer.name)}
                        icon={<FontAwesomeIcon icon={faTrashCan} />}
                      />
                    </Col>
                  )}
                </Row>
              </div>
            ))}

            <Form.Item className='mcq-answer__add-answer-btn'>
              <Button type='primary' shape='round' style={{ padding: '0 40px' }} onClick={() => addAnswer()}>
                Add Answer
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  )
}

export default McqAnswer
