import React from 'react'

import FormImageRadio from 'components/FormImageRadio'

import './style.scss'

const Question = ({
  contentCommon,
  answerChose,
  onChoiceAnswer,
  dataGroupQuestion,
  dataGroupAnswer,
  indexGroupQuestion
}) => {
  const listRadio = [
    {
      label: contentCommon.answerA,
      value: contentCommon.answerA.toLowerCase(),
    },
    {
      label: contentCommon.answerB,
      value: contentCommon.answerB.toLowerCase(),
    },
    {
      label: contentCommon.answerC,
      value: contentCommon.answerC.toLowerCase(),
    },
    {
      label: contentCommon.answerD,
      value: contentCommon.answerD.toLowerCase(),
    },
    {
      label: contentCommon.answerE,
      value: contentCommon.answerE.toLowerCase(),
    },
    {
      label: contentCommon.answerF,
      value: contentCommon.answerF.toLowerCase(),
    },
    {
      label: contentCommon.answerG,
      value: contentCommon.answerG.toLowerCase(),
    },
    {
      label: contentCommon.answerH,
      value: contentCommon.answerH.toLowerCase(),
    },
  ]
  return (
    <div className='question'>
      <p className='question__content'>
        <img src={dataGroupQuestion.src} width='300' alt={dataGroupQuestion.alt} />
      </p>
      <FormImageRadio
        answerChose={answerChose}
        dataGroupAnswer={dataGroupAnswer}
        listRadio={listRadio}
        dataQuestion={dataGroupQuestion}
        onChoiceAnswer={onChoiceAnswer}
        indexGroupQuestion={indexGroupQuestion}
      />
    </div>
  )
}

export default Question
