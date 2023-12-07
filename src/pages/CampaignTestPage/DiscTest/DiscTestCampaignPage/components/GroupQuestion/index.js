import React from 'react'

import useMergeState from 'hooks/useMergeState'

import Question from '../Question'

import './style.scss'

const GroupQuestion = ({
  dataGroupQuestion,
  indexGroupQuestion,
  onChangeRadio,
  contentCommon,
}) => {
  const [answerChose, setAnswerChose] = useMergeState({
    most: dataGroupQuestion.answer.most.keyIdQuestion,
    least: dataGroupQuestion.answer.least.keyIdQuestion,
  })

  const handleChoiceAnswer = (typeQuestion, questionId) => {
    setAnswerChose({ [typeQuestion]: questionId })
  }

  return (
    <div data-id={`Câu hỏi ${indexGroupQuestion}`} className='group-question'>
      <p className='group-question__title'>Câu hỏi {indexGroupQuestion}</p>
      {dataGroupQuestion.listQuestion.map((question) => (
        <Question
          key={question.keyIdQuestion}
          answerChose={answerChose}
          dataGroupQuestion={dataGroupQuestion}
          dataQuestion={question}
          onChangeRadio={onChangeRadio}
          onChoiceAnswer={handleChoiceAnswer}
          contentCommon={contentCommon}
        />
      ))}
    </div>
  )
}

export default GroupQuestion
