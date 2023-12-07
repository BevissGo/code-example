import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import LoginModal from 'components/LoginModal'
import ButtonArrow from 'components/Button/Arrow'
import ButtonDefault from 'components/Button/Default'
import CountdownTimer from 'components/CountdownTimer'
import ExtraQuestionModal from 'components/ExtraQuestionModal'
import GroupQuestion from 'pages/IQTestPage/components/GroupQuestion'
import './style.scss'
import DefaultSurveyModal from 'components/DefaultSurveyModal'

const TemplateIQTest = ({
  position,
  listAnswer,
  requiredStep,
  contentCommon,
  listGroupAnswer,
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
  onTimedOut,
  onOpenLoginModal,
  onSubmitAnswerExtraQuestion,
}) => {
  const STEP_ONE = 'STEP_ONE'
  const STEP_TWO = 'STEP_TWO'

  const loadingSubmit = useSelector((state) => state.IQTest.loadingPost)
  const [firstLoginStep, setFirstLoginStep] = useState(STEP_ONE)

  const generateTitle = () => {
    return `Câu hỏi ${indexPageSurvey * maxGroupQuestionPerSurveyPage + 1} -
    ${indexPageSurvey * maxGroupQuestionPerSurveyPage + listGroupQuestion.length}`
  }

  return (
    <>
      <div className='template-iqtest'>
        <div className='template-iqtest__header'>
          <div className='template-iqtest__header__top flex justify-between'>
            <div className='template-iqtest__header__title'>{generateTitle()}</div>
            <div className='template-iqtest__header__clock'>
              <CountdownTimer testTime={30 * 60} onTimedOut={onTimedOut} />
            </div>
          </div>
          <div className='template-iqtest__header__subscription'>{contentContainer.subscription}</div>
        </div>
        <div className='template-iqtest__body'>
          {listGroupQuestion.map((groupQuestion, inx) => (
            <GroupQuestion
              key={groupQuestion.alt}
              dataGroupQuestion={groupQuestion}
              dataGroupAnswer={listGroupAnswer[inx]}
              indexGroupQuestion={indexPageSurvey * maxGroupQuestionPerSurveyPage + (inx + 1)}
              contentCommon={contentCommon}
              answerChose={listAnswer[indexPageSurvey * maxGroupQuestionPerSurveyPage + inx]}
            />
          ))}
        </div>
        <div className={`template-iqtest__footer flex${indexPageSurvey === 0 ? ' justify-end' : ' justify-between'}`}>
          {indexPageSurvey !== 0 && (
            <ButtonArrow survey transparent label={contentCommon.backSurvey} onClick={onBack} />
          )}
          {indexPageSurvey !== amountPageSurvey - 1 ? (
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

export default TemplateIQTest
