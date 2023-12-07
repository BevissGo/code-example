import './style.scss'
import React from 'react'
import { useSelector } from 'react-redux'
import SurveyModal from 'components/SurveyModal'
import LoginModal from 'components/LoginModal'
import ButtonArrow from 'components/Button/Arrow'
import ButtonDefault from 'components/Button/Default'
import CountdownTimer from 'components/CountdownTimer'
import GroupQuestion from 'pages/CampaignTestPage/IQTest/IQTestCampaignPage/components/GroupQuestion'

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
  showSurvey,
  loginModalVisible,
  profileLoadingSubmit,
  maxGroupQuestionPerSurveyPage,
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
            // <ButtonArrow survey transparent label={contentCommon.backSurvey} onClick={onBack} />
            <div />
          )}
          {indexPageSurvey !== amountPageSurvey - 1 ? (
            <ButtonArrow survey label={contentCommon.nextSurvey} onClick={onNext} />
          ) : (
            <ButtonDefault loading={loadingSubmit} label={contentCommon.finishSurvey} onClick={onSubmit} />
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

export default TemplateIQTest
