import React from 'react'
import { useSelector } from 'react-redux'

import LoginModal from 'components/LoginModal'
import ButtonArrow from 'components/Button/Arrow'
import ButtonDefault from 'components/Button/Default'
import CountdownTimer from 'components/CountdownTimer'
import Question from 'pages/EQTestPage/components/Question'
import SurveyModal from 'components/SurveyModal'

import './style.scss'

const TemplateEQTest = ({
  position,
  listAnswer,
  requiredStep,
  contentCommon,
  listEQQuestion,
  isAuthenticated,
  indexPageEQTest,
  amountPageEQTest,
  contentContainer,
  showSurveyQuestion,
  loginModalVisible,
  profileLoadingSubmit,
  maxQuestionPerEQTestPage,
  survey,
  // onBack,
  onNext,
  onSubmit,
  onTimedOut,
  onOpenLoginModal,
  onSubmitAnswerSurvey,
}) => {
  const loadingSubmit = useSelector((state) => state.report.loadingPost)

  const generateTitle = () => {
    return `Câu hỏi ${indexPageEQTest * maxQuestionPerEQTestPage + 1} -
    ${indexPageEQTest * maxQuestionPerEQTestPage + listEQQuestion.length}`
  }

  return (
    <>
      <div className='template-eq-test'>
        <div className='template-eq-test__header'>
          <div className='template-eq-test__header__top flex justify-between'>
            <div className='template-eq-test__header__title'>{generateTitle()}</div>
            <div className='template-eq-test__header__clock'>
              <CountdownTimer testTime={15 * 60} onTimedOut={onTimedOut} />
            </div>
          </div>
          <div className='template-eq-test__header__subscription'>{contentContainer.subscription}</div>
        </div>
        <div className='template-eq-test__body'>
          {listEQQuestion?.map((question, index) => (
            <div className='template-eq-test__body__eq-question' key={question.id}>
              <Question
                question={question}
                listAnswer={[
                  {
                    answer: contentContainer.yesAnswer,
                    value: question.yesAnswerScore,
                  },
                  {
                    answer: contentContainer.noAnswer,
                    value: question.noAnswerScore,
                  },
                ]}
                index={index + 1 + indexPageEQTest * maxQuestionPerEQTestPage}
                chosenAnswer={listAnswer[index + indexPageEQTest * maxQuestionPerEQTestPage]}
              />
            </div>
          ))}
        </div>
        <div className='template-eq-test__footer flex justify-between'>
          {indexPageEQTest >= 0 && (
            //  <ButtonArrow survey transparent label={contentCommon.backSurvey} onClick={onBack} />
            <div />
          )}
          {indexPageEQTest !== amountPageEQTest - 1 ? (
            <ButtonArrow survey label={contentCommon.nextSurvey} onClick={onNext} />
          ) : (
            <ButtonDefault loading={loadingSubmit} label={contentCommon.finishSurvey} onClick={onSubmit} />
          )}
        </div>
      </div>
      <SurveyModal show={showSurveyQuestion} onSubmit={onSubmitAnswerSurvey} position={position} survey={survey} />
      {loginModalVisible && (
        <LoginModal
          requiredStep={requiredStep}
          loading={profileLoadingSubmit}
          isAuthenticated={isAuthenticated}
          onOpenLoginModal={onOpenLoginModal}
        />
      )}
    </>
  )
}

export default TemplateEQTest
