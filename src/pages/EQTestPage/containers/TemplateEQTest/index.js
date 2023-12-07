import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import LoginModal from 'components/LoginModal'
import ButtonArrow from 'components/Button/Arrow'
import ButtonDefault from 'components/Button/Default'
import CountdownTimer from 'components/CountdownTimer'
import Question from 'pages/EQTestPage/components/Question'
import ExtraQuestionModal from 'components/ExtraQuestionModal'

import './style.scss'
import DefaultSurveyModal from 'components/DefaultSurveyModal'

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
  showExtraQuestion,
  loginModalVisible,
  profileLoadingSubmit,
  maxQuestionPerEQTestPage,
  facebookProfileUrl,
  onBack,
  onNext,
  onSubmit,
  onTimedOut,
  onOpenLoginModal,
  onSubmitAnswerExtraQuestion,
}) => {
  const STEP_ONE = 'STEP_ONE'
  const STEP_TWO = 'STEP_TWO'

  const loadingSubmit = useSelector((state) => state.EQTest.loadingPost)
  const [firstLoginStep, setFirstLoginStep] = useState(STEP_ONE)

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
          {indexPageEQTest >= 0 && <ButtonArrow survey transparent label={contentCommon.backSurvey} onClick={onBack} />}
          {indexPageEQTest !== amountPageEQTest - 1 ? (
            <ButtonArrow survey label={contentCommon.nextSurvey} onClick={onNext} />
          ) : (
            <ButtonDefault loading={loadingSubmit} label={contentCommon.finishSurvey} onClick={onSubmit} />
          )}
        </div>
      </div>
      <ExtraQuestionModal show={showExtraQuestion} onSubmit={onSubmitAnswerExtraQuestion} position={position} />
      {!isAuthenticated && loginModalVisible && (
        <LoginModal
          requiredStep={requiredStep}
          loading={profileLoadingSubmit}
          isAuthenticated={isAuthenticated}
          onOpenLoginModal={onOpenLoginModal}
        />
      )}
      {isAuthenticated && loginModalVisible && !facebookProfileUrl && firstLoginStep === STEP_ONE && (
        <DefaultSurveyModal isAuthenticated={isAuthenticated} onSubmit={() => setFirstLoginStep(STEP_TWO)} />
      )}
      {isAuthenticated && loginModalVisible && firstLoginStep === STEP_TWO && (
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
