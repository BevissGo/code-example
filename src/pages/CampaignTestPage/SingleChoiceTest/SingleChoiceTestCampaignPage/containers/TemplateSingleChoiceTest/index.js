import './style.scss'
import React from 'react'
import { useSelector } from 'react-redux'
import LoginModal from 'components/LoginModal'
import ButtonArrow from 'components/Button/Arrow'
import ButtonDefault from 'components/Button/Default'
import CountdownTimer from 'components/CountdownTimer'
import SurveyModal from 'components/SurveyModal'
import Question from '../../components/Question'

const TemplateSingleChoiceTest = ({
  position,
  listAnswer,
  requiredStep,
  contentCommon,
  listSingleChoiceQuestion,
  isAuthenticated,
  indexPageSingleChoiceTest,
  amountPageSingleChoiceTest,
  contentContainer,
  showAdditionalQuestion,
  loginModalVisible,
  profileLoadingSubmit,
  maxQuestionPerSingleChoiceTestPage,
  // onBack,
  onNext,
  onSubmit,
  onTimedOut,
  onOpenLoginModal,
  onSubmitAnswerAdditionalQuestion,
}) => {
  const loadingSubmit = useSelector((state) => state.singleChoiceTest.loadingPost)

  const generateTitle = () => {
    return `Câu hỏi ${indexPageSingleChoiceTest * maxQuestionPerSingleChoiceTestPage + 1} -
    ${indexPageSingleChoiceTest * maxQuestionPerSingleChoiceTestPage + listSingleChoiceQuestion.length}`
  }

  return (
    <>
      <div className='template-eq-test'>
        <div className='template-eq-test__header'>
          <div className='template-eq-test__header__top flex justify-between'>
            <div className='template-eq-test__header__title'>{generateTitle()}</div>
            <div className='template-eq-test__header__clock'>
              <CountdownTimer testTime={Number(position?.single_choice_time ?? 0) * 60} onTimedOut={onTimedOut} />
            </div>
          </div>
          <div className='template-eq-test__header__subscription'>{contentContainer.subscription}</div>
        </div>
        <div className='template-eq-test__body'>
          {listSingleChoiceQuestion?.map((question, index) => (
            <div className='template-eq-test__body__eq-question' key={question._id}>
              <Question
                question={question}
                listAnswer={question?.answer_list}
                index={index + 1 + indexPageSingleChoiceTest * maxQuestionPerSingleChoiceTestPage}
                chosenAnswer={listAnswer[index + indexPageSingleChoiceTest * maxQuestionPerSingleChoiceTestPage]}
              />
            </div>
          ))}
        </div>
        <div className='template-eq-test__footer flex justify-between'>
          {indexPageSingleChoiceTest >= 0 && (
            //  <ButtonArrow survey transparent label={contentCommon.backSurvey} onClick={onBack} />
            <div />
          )}
          {indexPageSingleChoiceTest !== amountPageSingleChoiceTest - 1 ? (
            <ButtonArrow survey label={contentCommon.nextSurvey} onClick={onNext} />
          ) : (
            <ButtonDefault loading={loadingSubmit} label={contentCommon.finishSurvey} onClick={onSubmit} />
          )}
        </div>
      </div>
      <SurveyModal show={showAdditionalQuestion} onSubmit={onSubmitAnswerAdditionalQuestion} position={position} />
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

export default TemplateSingleChoiceTest
