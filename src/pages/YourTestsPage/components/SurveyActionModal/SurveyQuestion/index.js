import React from 'react'
import { Col, Form, Radio, Row } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import CustomInput from 'components/CustomInput'
import CustomRadio from 'components/CustomRadio'
import { REQUIRED_ANSWER_OPTION, TYPE_ANSWER_OPTION } from 'pages/YourTestsPage/constants'

import './style.scss'

function SurveyQuestion() {
  return (
    <div className='survey-question'>
      <Form.List name='questions' initialValue={[{}]}>
        {(questions, { add, remove }) => (
          <>
            {questions?.map((question, questionIndex) => (
              <div key={question.key} className='survey-question__question-group'>
                <div className='survey-question__question-header'>
                  <p className='survey-question__question-index'>Question {questionIndex + 1}</p>
                  <div>
                    <FontAwesomeIcon
                      className='survey-question__add-question-btn'
                      icon={faPlus}
                      onClick={() => {
                        add()
                      }}
                    />
                    {questions.length > 1 && (
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className='survey-question__remove-question-btn'
                        onClick={() => remove(question.name)}
                      />
                    )}
                  </div>
                </div>
                <Form.Item
                  label={<span className='survey-question__form-label'> Question</span>}
                  name={[question.name, 'question']}
                  rules={[
                    {
                      required: true,
                      message: 'Please fill the question',
                    },
                  ]}
                >
                  <CustomInput />
                </Form.Item>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={<span className='survey-question__form-label--small'>Type</span>}
                      name={[question.name, 'required_answer']}
                      rules={[{ required: true, message: 'Please select required answer!' }]}
                    >
                      <Radio.Group>
                        {REQUIRED_ANSWER_OPTION.map((option, index) => (
                          <CustomRadio key={index} value={option.value}>
                            <span>{option.label}</span>
                          </CustomRadio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={<span className='survey-question__form-label--small'>Format</span>}
                      name={[question.name, 'type_answer']}
                      rules={[{ required: true, message: 'Please select answer type!' }]}
                    >
                      <Radio.Group>
                        {TYPE_ANSWER_OPTION.map((option, index) => (
                          <CustomRadio key={index} value={option.value}>
                            <span>{option.label}</span>
                          </CustomRadio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ))}
          </>
        )}
      </Form.List>
    </div>
  )
}

export default SurveyQuestion
