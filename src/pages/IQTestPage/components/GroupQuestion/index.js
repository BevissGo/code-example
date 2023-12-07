import React from 'react'

import Question from '../Question'

import './style.scss'

const GroupQuestion = ({ dataGroupQuestion, dataGroupAnswer, indexGroupQuestion, contentCommon, answerChose }) => {
  return (
    <div data-id={`Câu ${indexGroupQuestion}`} className='group-question'>
      <div className='group-question__wrapper-title'>
        <p className='group-question__title'>Câu {indexGroupQuestion}</p>
        <p className='group-question__title'>Chọn đáp án đúng</p>
      </div>
      <Question
        key={dataGroupQuestion.src}
        dataGroupQuestion={dataGroupQuestion}
        dataGroupAnswer={dataGroupAnswer}
        dataQuestion={dataGroupQuestion}
        indexGroupQuestion={indexGroupQuestion}
        contentCommon={contentCommon}
        answerChose={answerChose}
      />
    </div>
  )
}

export default GroupQuestion
