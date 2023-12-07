import React from 'react'
import { useSelector } from 'react-redux'

import LoginModal from 'components/LoginModal'
import ButtonArrow from 'components/Button/Arrow'
import ButtonDefault from 'components/Button/Default'
import CountdownTimer from 'components/CountdownTimer'
import SurveyModal from 'components/SurveyModal'
import Question from '../../components/Question'
import './style.scss'

const TemplateCustomTest = ({
  position,
  listAnswer,
  requiredStep,
  contentCommon,
  listCustomTestQuestion,
  isAuthenticated,
  indexPageCustomTest,
  amountPageCustomTest,
  contentContainer,
  showSurvey,
  loginModalVisible,
  profileLoadingSubmit,
  maxQuestionPerCustomTestPage,
  survey,
  test,
  // onBack,
  onNext,
  onSubmit,
  onTimedOut,
  onOpenLoginModal,
  onSubmitAnswerSurveyQuestion,
}) => {
  const loadingSubmit = useSelector((state) => state.customTest.loadingPost)

  const generateTitle = () => {
    return `Câu hỏi ${indexPageCustomTest * maxQuestionPerCustomTestPage + 1} -
    ${indexPageCustomTest * maxQuestionPerCustomTestPage + listCustomTestQuestion?.length}`
  }

  return (
    <>
      <div className='template-custom-test'>
        <div className='template-custom-test__header'>
          <div className='template-custom-test__header__top flex justify-between'>
            <div className='template-custom-test__header__title'>{generateTitle()}</div>
            {test?.test_id?.duration_time ? (
              <div className='template-custom-test__header__clock'>
                <CountdownTimer testTime={Number(test?.test_id?.duration_time ?? 0) * 60} onTimedOut={onTimedOut} />
              </div>
            ) : null}
          </div>
          <div className='template-custom-test__header__subscription'>{contentContainer.subscription}</div>
        </div>
        <div className='template-custom-test__body'>
          {listCustomTestQuestion?.map((question, index) => (
            <div className='template-custom-test__body__custom-question' key={question._id}>
              <Question
                question={question}
                listAnswer={question?.answer_list}
                index={index + 1 + indexPageCustomTest * maxQuestionPerCustomTestPage}
                chosenAnswer={listAnswer[index + indexPageCustomTest * maxQuestionPerCustomTestPage]}
              />
            </div>
          ))}
        </div>
        <div className='template-custom-test__footer flex justify-between'>
          {indexPageCustomTest >= 0 && (
            //  <ButtonArrow survey transparent label={contentCommon.backSurvey} onClick={onBack} />
            <div />
          )}
          {indexPageCustomTest !== amountPageCustomTest - 1 ? (
            <ButtonArrow survey label={contentCommon.nextSurvey} onClick={onNext} />
          ) : (
            <ButtonDefault loading={loadingSubmit} label={contentCommon.finishSurvey} onClick={onSubmit} />
          )}
        </div>
      </div>
      <SurveyModal show={showSurvey} onSubmit={onSubmitAnswerSurveyQuestion} position={position} survey={survey} />
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

export default TemplateCustomTest
