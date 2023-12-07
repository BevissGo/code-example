import React from 'react'

import './style.scss'
import FormRadio from '../FormRadio'

const Question = ({ question, listAnswer, index, chosenAnswer }) => {
  const listRadio = listAnswer.map((answer) => ({
    questionId: question.id,
    label: answer.answer,
    value: answer.value,
  }))

  return (
    <div>
      <div data-id={`Câu ${index}`} className='brain-question__title'>
        Câu {index}:&nbsp;
        <span className='brain-question__content'>{question.question}</span>
      </div>

      <FormRadio
        index={index}
        listRadio={listRadio}
        chosenAnswer={chosenAnswer}
      />
    </div>
  )
}

export default Question
