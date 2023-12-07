import React from 'react'
import { Form } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import CustomInput from 'components/CustomInput'

import McqAnswer from './McqAnswer'

import './style.scss'

function McqQuestion({ type, form }) {
  return (
    <div className='mcq-question'>
      <Form.List
        name='question_list'
        initialValue={[{ answer_list: [{ answer: '', is_correct: false }], question: '' }]}
      >
        {(questions, { add, remove }) => (
          <>
            {questions?.map((question, questionIndex) => (
              <div key={question.key} className='mcq-question__question-group'>
                <div className='mcq-question__question-header'>
                  <p className='mcq-question__question-index'>Question {questionIndex + 1}</p>
                  <div>
                    <FontAwesomeIcon
                      className='mcq-question__add-question-btn'
                      icon={faPlus}
                      onClick={() => {
                        add()
                      }}
                    />
                    {questions.length > 1 && (
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className='mcq-question__remove-question-btn'
                        onClick={() => remove(question.name)}
                      />
                    )}
                  </div>
                </div>
                <Form.Item
                  label={<span className='mcq-question__question'> Question</span>}
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
                <McqAnswer type={type} form={form} question={question} questionIndex={questionIndex} />
              </div>
            ))}
          </>
        )}
      </Form.List>
    </div>
  )
}

export default McqQuestion
