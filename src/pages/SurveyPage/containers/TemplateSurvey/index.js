import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import ButtonArrow from 'components/Button/Arrow'
import ButtonDefault from 'components/Button/Default'
import ExtraQuestionModal from 'components/ExtraQuestionModal'
import GroupQuestion from 'pages/SurveyPage/components/GroupQuestion'

import './style.scss'
import DefaultSurveyModal from 'components/DefaultSurveyModal'
import LoginModal from 'components/LoginModal'

const TemplateSurvey = ({
  position,
  requiredStep,
  contentCommon,
  indexPageSurvey,
  isAuthenticated,
  amountPageSurvey,
  contentContainer,
  listGroupQuestion,
  showExtraQuestion,
  loginModalVisible,
  profileLoadingSubmit,
  maxGroupQuestionPerSurveyPage,
  facebookProfileUrl,
  onBack,
  onNext,
  onSubmit,
  onChangeRadio,
  onOpenLoginModal,
  onSubmitAnswerExtraQuestion,
}) => {
  const STEP_ONE = 'STEP_ONE'
  const STEP_TWO = 'STEP_TWO'

  const loadingSubmit = useSelector((state) => state.report.loadingPost)
  const [firstLoginStep, setFirstLoginStep] = useState(STEP_ONE)

  const generateTitle = () => {
    return `Câu hỏi ${indexPageSurvey * maxGroupQuestionPerSurveyPage + 1} -
    ${indexPageSurvey * maxGroupQuestionPerSurveyPage + listGroupQuestion.length}`
  }

  return (
    <>
      <div className='template-survey'>
        <div className='template-survey__header'>
          <div className='template-survey__header__title'>{generateTitle()}</div>
          <div className='template-survey__header__subscription'>{contentContainer.subscription}</div>
        </div>
        <div className='template-survey__body'>
          {listGroupQuestion.map((groupQuestion, inx) => (
            <GroupQuestion
              key={groupQuestion.keyIdGroupQuestion}
              dataGroupQuestion={groupQuestion}
              indexGroupQuestion={indexPageSurvey * maxGroupQuestionPerSurveyPage + (inx + 1)}
              onChangeRadio={onChangeRadio}
              contentCommon={contentCommon}
            />
          ))}
        </div>
        <div className={`template-survey__footer flex${indexPageSurvey === 0 ? ' justify-end' : ' justify-between'}`}>
          {indexPageSurvey !== 0 && (
            <ButtonArrow survey label={contentCommon.backSurvey} transparent onClick={onBack} />
          )}
          {indexPageSurvey !== amountPageSurvey - 1 ? (
            <ButtonArrow survey label={contentCommon.nextSurvey} onClick={onNext} />
          ) : (
            <ButtonDefault label={contentCommon.finishSurvey} loading={loadingSubmit} onClick={onSubmit} />
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

export default TemplateSurvey
