import './style.scss'
import React from 'react'
import FormRadio from '../FormRadio'

const Question = ({ question, listAnswer, index, chosenAnswer }) => {
  const listRadio = listAnswer?.map((answer) => ({
    questionId: question?._id,
    label: answer?.answer,
    value: answer?.is_correct ?? false,
  }))

  return (
    <div>
      <div data-id={`Câu ${index}`} className='eq-question__title'>
        Câu {index}:&nbsp;
        <span className='eq-question__content'>{question.question}</span>
      </div>

      <FormRadio index={index} listRadio={listRadio} chosenAnswer={chosenAnswer} />
    </div>
  )
}

export default Question
