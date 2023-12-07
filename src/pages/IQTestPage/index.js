import './style.scss'
import React, { useState, useEffect, useCallback } from 'react'
import { isEmpty } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import config from 'configs'
import i18nVN from 'i18n/locales/vn'
import { iqTestPage } from 'constants/images'
import useMergeState from 'hooks/useMergeState'
import TemplatePage from 'containers/TemplatePage'
import { checkForHexRegExp, redirectToWithReplace } from 'utils'
import { getCurrentListGroupQuestion, toastifyNotify } from 'helpers'
import businessManagement from 'assets/images/business-management.svg'
import { fetchPosition } from 'redux/services/position'
import { updateFacebookProfileUrl } from 'redux/services/profile'
import { handleOpenModalFailure } from 'redux/services/modalError'
import { handleOpenModalTimedOut } from 'redux/services/modalTimedOut'
import { submitIQTest, submitIQTestWithPosition } from 'redux/services/IQTest'
import Background from 'components/Background'
import GoogleSignIn from 'components/Button/GoogleSignIn'
import AddFacebookProfile from 'components/LoginModal/containers/AddFacebookProfileStep'
import ProgressBar from 'pages/IQTestPage/components/ProgressBar'
import IQModalFinish from 'pages/IQTestPage/containers/IQModal/Finish'
import TemplateIQTest from 'pages/IQTestPage/containers/TemplateIQTest'
import IQModalInstructor from 'pages/IQTestPage/containers/IQModal/Instructor'

const IQTestPage = (props) => {
  const { position_id: positionId } = props.match.params
  const [facebookProfileInput, setFacebookProfileInput] = useState('')
  const [loginModalVisible, setLoginModalVisible] = useState(false)
  const [position, setPosition] = useState({})
  const [showExtraQuestion, setShowExtraQuestion] = useState(false)
  const [answerExtraQuestion, setAnswerExtraQuestion] = useState([])

  // Step is current page (instructor page is step 0)
  const [step, setStep] = useState(0)
  const [dataPage, setDataPage] = useMergeState({
    currentPage: 0,
    nextPage: 1,
  })

  const [requiredSteps, setRequiredSteps] = useState([])

  const {
    common: contentCommon,
    pages: { iqTest: contentPage },
  } = i18nVN.src

  const {
    pages: {
      signup: { loginModal: loginContent },
    },
  } = i18nVN.src

  const {
    pages: {
      signup: { updateProfileModal: updateProfileContent },
    },
  } = i18nVN.src

  // Get amount group question per page
  const { maxGroupQuestionPerSurveyPage } = config

  const dispatch = useDispatch()
  const history = useHistory()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  // Get list answer IQ choose by user
  const listAnswerByUser = useSelector((state) => state.IQTest.listAnswer)

  // Get facebook profile url
  const facebookProfileUrl = useSelector((state) => state.profile.profile.facebook_profile_url)

  // Get facebook profile url submitting loading status
  const profileLoadingSubmit = useSelector((state) => state.profile.loadingPut)

  const currentListAnswerByUser = Object.values(listAnswerByUser)
  const listGroupQuestion = Object.values(iqTestPage.listQuestion)
  const listGroupAnswer = Object.values(iqTestPage.listAnswer)

  // Get list group question of current page
  const currentListGroupQuestion = getCurrentListGroupQuestion(
    dataPage.currentPage,
    listGroupQuestion,
    maxGroupQuestionPerSurveyPage,
  )
  const currentListGroupAnswer = getCurrentListGroupQuestion(
    dataPage.currentPage,
    listGroupAnswer,
    maxGroupQuestionPerSurveyPage,
  )

  const getPosition = useCallback(async () => {
    if (!checkForHexRegExp.test(`${positionId}`)) {
      redirectToWithReplace(history, `/${positionId}`)
      return
    }

    await fetchPosition(positionId, setPosition, history, 'iq_score_id')
  }, [positionId, history])

  // Check current list group question have element which was not answered
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCheckListGroupQuestionWasAnswered = (listIndexError) => {
    const listAnswerByUserAtCurrentPage = getCurrentListGroupQuestion(
      dataPage.currentPage,
      Object.entries(currentListAnswerByUser),
      maxGroupQuestionPerSurveyPage,
    )

    listAnswerByUserAtCurrentPage.forEach((answer, inx) => {
      if (answer[1] === null) {
        listIndexError.push(`Câu ${5 * dataPage.currentPage + inx + 1}`)
      }
    })
  }

  const handleIqSubmitWithPosition = useCallback(
    async (listAnswer) => {
      dispatch(submitIQTestWithPosition(() => setStep((prev) => prev + 1), listAnswer, position, answerExtraQuestion))
    },
    [position, dispatch, answerExtraQuestion],
  )

  const [time, setTime] = useState(0)

  const handleStartSurvey = () => {
    setStep(1)
    setTime(Date.now())
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSurveySubmit = () => {
    let listIndexError = []
    handleCheckListGroupQuestionWasAnswered(listIndexError)

    if (listIndexError?.length) {
      dispatch(handleOpenModalFailure(null, listIndexError))
      return
    }
    if (!listIndexError?.length && !facebookProfileUrl) {
      setLoginModalVisible(true)
      return
    }

    if (JSON.stringify(position) !== '{}') {
      if (!!position.extra_question?.length && !answerExtraQuestion?.length) {
        setShowExtraQuestion(true)
      } else {
        handleIqSubmitWithPosition(currentListAnswerByUser)
      }
    } else {
      const testDuration = Math.ceil((Date.now() - time) / 1000)
      dispatch(submitIQTest(() => setStep((prev) => prev + 1), currentListAnswerByUser, testDuration))
      setTime(0)
    }
  }

  // Fetch position if position
  useEffect(() => {
    if (positionId) {
      getPosition()
    }
  }, [positionId, getPosition])

  useEffect(() => {
    if (!isEmpty(position) && !position?.category_test?.includes('IqScore')) {
      redirectToWithReplace(history, '/')
      toastifyNotify('error', 'Position invalid!!!')
      return
    }
  }, [position, history])

  const handleFacebookProfileInputBlur = useCallback((e) => setFacebookProfileInput(e.target.value), [])

  const handleFacebookProfileAndSurveySubmit = useCallback(
    (fbUrl) => () => {
      const submitProfileSuccess = dispatch(updateFacebookProfileUrl(fbUrl))
      if (submitProfileSuccess) {
        setLoginModalVisible(false)
      }
    },
    [dispatch],
  )

  useEffect(() => {
    const steps = []
    if (!isAuthenticated) {
      steps.push({
        title: loginContent.title,
        imgSrc: businessManagement,
        description: loginContent.description,
        action: <GoogleSignIn />,
      })
    }
    if (!facebookProfileUrl) {
      steps.push({
        imgSrc: businessManagement,
        title: updateProfileContent.title,
        description: updateProfileContent.description,
        action: (
          <AddFacebookProfile
            loading={profileLoadingSubmit}
            onBlur={handleFacebookProfileInputBlur}
            onClick={handleFacebookProfileAndSurveySubmit(facebookProfileInput)}
          />
        ),
      })
    }

    setRequiredSteps(steps)

    let listIndexError = []
    handleCheckListGroupQuestionWasAnswered(listIndexError)

    if (
      !steps.length &&
      !listIndexError.length &&
      dataPage.currentPage + 1 === listGroupQuestion.length / maxGroupQuestionPerSurveyPage
    ) {
      handleSurveySubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAuthenticated,
    facebookProfileUrl,
    dataPage.currentPage,
    facebookProfileInput,
    profileLoadingSubmit,
    handleFacebookProfileAndSurveySubmit,
  ])

  useEffect(() => {
    let listIndexError = []
    handleCheckListGroupQuestionWasAnswered(listIndexError)
    if (answerExtraQuestion.length && !listIndexError.length) {
      handleSurveySubmit()
    }
  }, [answerExtraQuestion, handleCheckListGroupQuestionWasAnswered, handleSurveySubmit])

  // Amount page from (amount list group question) / (amount question per page), > 5.0 => 6 pages
  const handleCountTotalPage = () => {
    return Math.round(listGroupQuestion.length / maxGroupQuestionPerSurveyPage + 0.4)
  }

  const handleBackSurveyPage = () => {
    setStep(step - 1)
    setDataPage({
      currentPage: dataPage.currentPage - 1,
      nextPage: dataPage.nextPage - 1,
    })
  }

  const handleNextSurveyPage = () => {
    let listIndexError = []
    handleCheckListGroupQuestionWasAnswered(listIndexError)

    if (listIndexError?.length === 0) {
      setStep(step + 1)
      setDataPage({
        currentPage: dataPage.currentPage + 1,
        nextPage: dataPage.nextPage + 1,
      })
      window.scrollTo(0, 0)
    } else {
      dispatch(handleOpenModalFailure(null, listIndexError))
    }
  }

  const handleAnswerExtraQuestion = async (e) => {
    setAnswerExtraQuestion(e.answerExtraQuestion)
  }

  const handleOpenLoginModal = () => {
    setLoginModalVisible((prev) => !prev)
  }

  const [trigger, setTrigger] = useState(false)
  useEffect(() => {
    if (trigger) {
      if (!facebookProfileUrl) {
        setLoginModalVisible(true)
        return
      }
      let answerCount = 0,
        totalQuestion = 0
      currentListAnswerByUser.forEach((answer) => {
        if (answer !== null) {
          answerCount++
        }
      })
      totalQuestion = currentListAnswerByUser.length

      dispatch(submitIQTest(() => {}, currentListAnswerByUser, 0))
      dispatch(handleOpenModalTimedOut(answerCount, totalQuestion, 'iq'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, facebookProfileUrl])

  const handleTimedOut = () => {
    setTrigger(true)
  }

  return (
    <>
      <TemplatePage namePage='survey-page' typeHeader='expand'>
        <Background />
        {step === 0 && (
          <IQModalInstructor
            amountPageSurvey={handleCountTotalPage()}
            contentContainer={contentPage.instructor}
            onStartSurvey={handleStartSurvey}
          />
        )}
        {step !== handleCountTotalPage() + 1 && step !== 0 && (
          <TemplateIQTest
            position={position}
            contentCommon={contentCommon}
            isAuthenticated={isAuthenticated}
            requiredStep={requiredSteps?.[0]}
            listAnswer={currentListAnswerByUser}
            loginModalVisible={loginModalVisible}
            showExtraQuestion={showExtraQuestion}
            indexPageSurvey={dataPage.currentPage}
            contentContainer={contentPage.template}
            listGroupAnswer={currentListGroupAnswer}
            amountPageSurvey={handleCountTotalPage()}
            profileLoadingSubmit={profileLoadingSubmit}
            listGroupQuestion={currentListGroupQuestion}
            maxGroupQuestionPerSurveyPage={maxGroupQuestionPerSurveyPage}
            facebookProfileUrl={facebookProfileUrl}
            onNext={handleNextSurveyPage}
            onBack={handleBackSurveyPage}
            onTimedOut={handleTimedOut}
            onSubmit={handleSurveySubmit}
            onOpenLoginModal={handleOpenLoginModal}
            onSubmitAnswerExtraQuestion={handleAnswerExtraQuestion}
          />
        )}
        {step === handleCountTotalPage() + 1 && (
          <IQModalFinish contentCommon={contentCommon} contentContainer={contentPage.finish} />
        )}
        {step !== handleCountTotalPage() + 1 && <ProgressBar step={step} amountPageSurvey={handleCountTotalPage()} />}
      </TemplatePage>
    </>
  )
}

export default IQTestPage
