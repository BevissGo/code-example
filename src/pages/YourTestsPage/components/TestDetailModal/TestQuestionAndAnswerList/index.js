import React from 'react'

import './style.scss'

function TestQuestionAndAnswerList({ testData }) {
  const { questionList } = testData

  return (
    <div className='test-question-and-answer-list'>
      <div className='test-question-and-answer-list__wrapper'>
        {questionList.map((question, questionIndex) => {
          return (
            <div key={questionIndex} className='test-question-and-answer-list__question-group'>
              <p className='test-question-and-answer-list__question-index'>Question {questionIndex + 1}</p>
              <p className='test-question-and-answer-list__question'>{question.question}</p>
              <div className='test-question-and-answer-list__answer-group'>
                {question.answerList.map((answer, answerIndex) => (
                  <p
                    key={answerIndex}
                    className={`test-question-and-answer-list__answer${answer.isCorrect ? '--correct' : ''}`}
                  >
                    {answerIndex + 1}. {answer.answer}
                  </p>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TestQuestionAndAnswerList
