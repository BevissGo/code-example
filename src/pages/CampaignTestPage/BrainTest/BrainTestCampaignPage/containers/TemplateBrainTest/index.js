import './style.scss'
import React from 'react'
import { useSelector } from 'react-redux'
import LoginModal from 'components/LoginModal'
import ButtonArrow from 'components/Button/Arrow'
import ButtonDefault from 'components/Button/Default'
import SurveyModal from 'components/SurveyModal'
import Question from 'pages/LeftRightBrainTestPage/components/Question'
import CountdownTimer from 'components/CountdownTimer'

const TemplateBrainTest = ({
  position,
  listAnswer,
  requiredStep,
  contentCommon,
  isAuthenticated,
  contentContainer,
  loginModalVisible,
  showSurvey,
  indexPageBrainTest,
  listLRBrainQuestion,
  amountPageBrainTest,
  profileLoadingSubmit,
  maxQuestionPerBrainTestPage,
  survey,
  // onBack,
  onNext,
  onSubmit,
  onOpenLoginModal,
  onSubmitAnswerSurvey,
  onTimedOut,
}) => {
  const loadingSubmit = useSelector((state) => state.report.loadingPost)

  const generateTitle = () => {
    return `Câu hỏi ${indexPageBrainTest * maxQuestionPerBrainTestPage + 1} -
    ${indexPageBrainTest * maxQuestionPerBrainTestPage + listLRBrainQuestion.length}`
  }

  return (
    <>
      <div className='template-brain-test'>
        <div className='template-brain-test__header'>
          <div className='template-brain-test__header__title'>
            <div className='template-survey__header__title'>
              {generateTitle()}
              <div className='template-iqtest__header__clock'>
                <CountdownTimer testTime={15 * 60} onTimedOut={onTimedOut} />
              </div>
            </div>
          </div>
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
            // <ButtonArrow survey label={contentCommon.backSurvey} transparent onClick={onBack} />
            <div />
          )}
          {indexPageBrainTest !== amountPageBrainTest - 1 ? (
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

export default TemplateBrainTest
