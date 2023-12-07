import './style.scss'
import React from 'react'
import { useSelector } from 'react-redux'
import ButtonArrow from 'components/Button/Arrow'
import LoginModal from 'components/LoginModal'
import ButtonDefault from 'components/Button/Default'
import SurveyModal from 'components/SurveyModal'
import GroupQuestion from 'pages/SurveyPage/components/GroupQuestion'
import CountdownTimer from 'components/CountdownTimer'

const TemplateSurvey = ({
  position,
  requiredStep,
  contentCommon,
  indexPageSurvey,
  isAuthenticated,
  amountPageSurvey,
  contentContainer,
  listGroupQuestion,
  showSurvey,
  loginModalVisible,
  profileLoadingSubmit,
  maxGroupQuestionPerSurveyPage,
  survey,
  // onBack,
  onNext,
  onSubmit,
  onChangeRadio,
  onOpenLoginModal,
  onSubmitAnswerSurvey,
  onTimedOut,
}) => {
  const loadingSubmit = useSelector((state) => state.report.loadingPost)

  const generateTitle = () => {
    return `Câu hỏi ${indexPageSurvey * maxGroupQuestionPerSurveyPage + 1} -
    ${indexPageSurvey * maxGroupQuestionPerSurveyPage + listGroupQuestion.length}`
  }

  return (
    <>
      <div className='template-survey'>
        <div className='template-survey__header'>
          <div className='template-survey__header__title'>
            {generateTitle()}
            <div className='template-iqtest__header__clock'>
              <CountdownTimer testTime={15 * 60} onTimedOut={onTimedOut} />
            </div>
          </div>
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
            // <ButtonArrow survey label={contentCommon.backSurvey} transparent onClick={onBack} />
            <div />
          )}
          {indexPageSurvey !== amountPageSurvey - 1 ? (
            <ButtonArrow survey label={contentCommon.nextSurvey} onClick={onNext} />
          ) : (
            <ButtonDefault label={contentCommon.finishSurvey} loading={loadingSubmit} onClick={onSubmit} />
          )}
        </div>
      </div>
      <SurveyModal show={showSurvey} onSubmit={onSubmitAnswerSurvey} position={position} survey={survey} />
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

export default TemplateSurvey
