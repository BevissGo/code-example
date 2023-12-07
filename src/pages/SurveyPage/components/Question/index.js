import React from 'react'

import FormRadio from 'components/FormRadio'

import './style.scss'

const Question = ({
  dataQuestion,
  onChangeRadio,
  contentCommon,
  answerChose,
  onChoiceAnswer,
  dataGroupQuestion,
}) => {
  const listRadio = [
    {
      label: contentCommon.answerMost,
      value: contentCommon.answerMost.toLowerCase(),
    },
    {
      label: contentCommon.answerLeast,
      value: contentCommon.answerLeast.toLowerCase(),
    },
  ]
  return (
    <div className='question'>
      <p className='question__content'>{dataQuestion.question}</p>
      <FormRadio
        answerChose={answerChose}
        dataGroupQuestion={dataGroupQuestion}
        listRadio={listRadio}
        dataQuestion={dataQuestion}
        onChangeRadio={onChangeRadio}
        onChoiceAnswer={onChoiceAnswer}
      />
    </div>
  )
}

export default Question
