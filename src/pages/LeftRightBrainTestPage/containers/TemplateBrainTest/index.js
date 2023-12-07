import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import LoginModal from 'components/LoginModal'
import ButtonArrow from 'components/Button/Arrow'
import ButtonDefault from 'components/Button/Default'
import ExtraQuestionModal from 'components/ExtraQuestionModal'
import Question from 'pages/LeftRightBrainTestPage/components/Question'
import './style.scss'
import DefaultSurveyModal from 'components/DefaultSurveyModal'

const TemplateBrainTest = ({
  position,
  listAnswer,
  requiredStep,
  contentCommon,
  isAuthenticated,
  contentContainer,
  loginModalVisible,
  showExtraQuestion,
  indexPageBrainTest,
  listLRBrainQuestion,
  amountPageBrainTest,
  profileLoadingSubmit,
  maxQuestionPerBrainTestPage,
  facebookProfileUrl,
  onBack,
  onNext,
  onSubmit,
  onOpenLoginModal,
  onSubmitAnswerExtraQuestion,
}) => {
  const STEP_ONE = 'STEP_ONE'
  const STEP_TWO = 'STEP_TWO'

  const loadingSubmit = useSelector((state) => state.brainTest.loadingPost)
  const [firstLoginStep, setFirstLoginStep] = useState(STEP_ONE)

  const generateTitle = () => {
    return `Câu hỏi ${indexPageBrainTest * maxQuestionPerBrainTestPage + 1} -
    ${indexPageBrainTest * maxQuestionPerBrainTestPage + listLRBrainQuestion.length}`
  }

  return (
    <>
      <div className='template-brain-test'>
        <div className='template-brain-test__header'>
          <div className='template-brain-test__header__title'>{generateTitle()}</div>
          <div className='template-brain-test__header__subscription'>{contentContainer.subscription}</div>
        </div>
        <div className='template-brain-test__body'>
          {listLRBrainQuestion?.map((question, index) => (
            <div className='brain-question' key={question.id}>
              <Question
                question={question}
                listAnswer={question.listAnswer}
                index={index + 1 + indexPageBrainTest * maxQuestionPerBrainTestPage}
                chosenAnswer={listAnswer[index + indexPageBrainTest * maxQuestionPerBrainTestPage]}
              />
            </div>
          ))}
        </div>
        <div className='template-brain-test__footer flex justify-between'>
          {indexPageBrainTest >= 0 && (
            <ButtonArrow survey label={contentCommon.backSurvey} transparent onClick={onBack} />
          )}
          {indexPageBrainTest !== amountPageBrainTest - 1 ? (
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

export default TemplateBrainTest
