import React, { useState, useEffect, useCallback, useRef } from 'react'
import { isEmpty } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import config from 'configs'
import i18nVN from 'i18n/locales/vn'
import { getCurrentListQuestion, toastifyNotify } from 'helpers'
import useMergeState from 'hooks/useMergeState'
import TemplatePage from 'containers/TemplatePage'
import { submitEQTest, fetchListEQQuestionIfNeeded, submitEQTestWithPosition } from 'redux/services/EQTest'
import { updateFacebookProfileUrl } from 'redux/services/profile'
import { handleOpenModalFailure } from 'redux/services/modalError'
import { handleOpenModalTimedOut } from 'redux/services/modalTimedOut'
import businessManagement from 'assets/images/business-management.svg'
import Background from 'components/Background'
import GoogleSignIn from 'components/Button/GoogleSignIn'
import AddFacebookProfile from 'components/LoginModal/containers/AddFacebookProfileStep'
import { checkForHexRegExp, redirectToWithReplace } from 'utils'
import { fetchPosition } from 'redux/services/position'
import ProgressBar from './components/ProgressBar'
import EQModalFinish from './containers/EQModal/Finish'
import TemplateEQTest from './containers/TemplateEQTest'
import EQModalInstructor from './containers/EQModal/Instructor'

import './style.scss'

const EQTestPage = (props) => {
  const {
    pages: { eqTest: contentPage },
    common: contentCommon,
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

  // Step is current page (instructor page is step 0)
  const [step, setStep] = useState(0)

  const [facebookProfileInput, setFacebookProfileInput] = useState('')
  const [loginModalVisible, setLoginModalVisible] = useState(false)
  const [showExtraQuestion, setShowExtraQuestion] = useState(false)
  const [answerExtraQuestion, setAnswerExtraQuestion] = useState([])
  const [position, setPosition] = useState({})
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const startedTime = useRef(null)
  const { position_id: positionId } = props.match.params

  const [dataPage, setDataPage] = useMergeState({
    currentPage: 0,
    nextPage: 1,
  })

  const [requiredSteps, setRequiredSteps] = useState([])

  const dispatch = useDispatch()
  const history = useHistory()

  // Get list EQ answer chosen by user
  const listAnswerByUser = useSelector((state) => state.EQTest.listEQAnswer)

  // Get facebook profile url
  const facebookProfileUrl = useSelector((state) => state.profile.profile.facebook_profile_url)

  // Get facebook profile url submitting loading status
  const profileLoadingSubmit = useSelector((state) => state.profile.loadingPut)

  const currentListAnswerByUser = Object.values(listAnswerByUser)

  const listEQQuestionObject = useSelector((state) => state.EQTest.listEQQuestion)

  // Get amount question per page
  const { maxQuestionPerEQTestPage } = config

  const listEQQuestion = Object.values(listEQQuestionObject)

  // Get list question of current page
  const currentListEQQuestion = getCurrentListQuestion(dataPage.currentPage, listEQQuestion, maxQuestionPerEQTestPage)

  const getPosition = async () => {
    if (!checkForHexRegExp.test(`${positionId}`)) {
      redirectToWithReplace(history, `/${positionId}`)
      return
    }

    await fetchPosition(positionId, setPosition, history, 'eq_score_id')
  }

  // Fetch position if position
  useEffect(() => {
    if (positionId) {
      getPosition()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isEmpty(position) && !position?.category_test?.includes('EqScore')) {
      redirectToWithReplace(history, '/')
      toastifyNotify('error', 'Position is invalid!!!')
      return
    }
  }, [position, history])

  // Fetch list question from database
  useEffect(() => {
    dispatch(fetchListEQQuestionIfNeeded())
    setStep(0)
    setDataPage({
      currentPage: 0,
      nextPage: 1,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, listEQQuestionObject])

  const handleStartEQTest = useCallback(() => {
    setStep(1)
    window.scroll(0, 0)
    startedTime.current = new Date()
    setTime(Date.now())
  }, [])

  // Amount page from (amount list group question) / (amount question per page), > 5.0 => 6 pages
  const handleCountTotalPage = () => {
    return Math.round(listEQQuestion.length / maxQuestionPerEQTestPage + 0.4)
  }

  // Check current list group question have element which was not answered
  const handleCheckListGroupQuestionWasAnswered = (listIndexError) => {
    const listAnswerByUserAtCurrentPage = getCurrentListQuestion(
      dataPage.currentPage,
      Object.entries(currentListAnswerByUser),
      maxQuestionPerEQTestPage,
    )

    listAnswerByUserAtCurrentPage.forEach((answer, inx) => {
      if (answer[1] === null) {
        listIndexError.push(`Câu ${maxQuestionPerEQTestPage * dataPage.currentPage + inx + 1}`)
      }
    })
  }

  const handleNextEQTestPage = () => {
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

  const handleBackEQTestPage = () => {
    setStep(step - 1)
    setDataPage({
      currentPage: dataPage.currentPage - 1 === -1 ? 0 : dataPage.currentPage - 1,
      nextPage: dataPage.nextPage - 1,
    })
  }

  const handleSurveySubmitWithPosition = useCallback(
    async (listAnswer, finishedTime) => {
      dispatch(
        submitEQTestWithPosition(
          () => setStep((prev) => prev + 1),
          listAnswer,
          position,
          answerExtraQuestion,
          finishedTime,
        ),
      )
    },
    [answerExtraQuestion, dispatch, position],
  )

  const [time, setTime] = useState(0)

  const handleSurveySubmit = () => {
    let finishedTime = new Date() - startedTime.current
    let listIndexError = []
    handleCheckListGroupQuestionWasAnswered(listIndexError)

    if (listIndexError?.length) {
      dispatch(handleOpenModalFailure(null, listIndexError))
      return
    }
    if (!listIndexError.length && !facebookProfileUrl) {
      setLoginModalVisible(true)
      return
    }
    if (JSON.stringify(position) !== '{}') {
      if (!!position?.extra_question?.length && !answerExtraQuestion?.length) {
        setShowExtraQuestion(true)
      } else {
        handleSurveySubmitWithPosition(currentListAnswerByUser, finishedTime)
      }
    } else {
      const testDuration = Math.ceil((Date.now() - time) / 1000)
      dispatch(submitEQTest(() => setStep((prev) => prev + 1), currentListAnswerByUser, testDuration))
    }
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

      dispatch(submitEQTest(() => {}, currentListAnswerByUser, 0))
      dispatch(handleOpenModalTimedOut(answerCount, totalQuestion, 'eq'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, facebookProfileUrl])

  const handleTimedOut = () => {
    setTrigger(true)
  }

  const handleFacebookProfileInputBlur = (e) => {
    setFacebookProfileInput(e.target.value)
  }

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
      dataPage.currentPage + 1 === Math.ceil(listEQQuestion.length / maxQuestionPerEQTestPage)
    ) {
      handleSurveySubmit()
    }
    // eslint-disable-next-line
  }, [isAuthenticated, facebookProfileUrl, facebookProfileInput, profileLoadingSubmit, dataPage.currentPage])

  useEffect(() => {
    let listIndexError = []
    handleCheckListGroupQuestionWasAnswered(listIndexError)
    if (answerExtraQuestion.length && !listIndexError.length) {
      handleSurveySubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerExtraQuestion])

  const handleOpenLoginModal = () => {
    if (trigger) return
    setLoginModalVisible((prev) => !prev)
  }

  const handleAnswerExtraQuestion = (e) => {
    setAnswerExtraQuestion(e.answerExtraQuestion)
  }

  return (
    <TemplatePage namePage='survey-page' typeHeader='expand'>
      <Background />
      {step === 0 && (
        <EQModalInstructor
          amountPageSurvey={handleCountTotalPage()}
          contentContainer={contentPage.instructor}
          onStartSurvey={handleStartEQTest}
        />
      )}
      {step !== handleCountTotalPage() + 1 && step !== 0 && (
        <TemplateEQTest
          position={position}
          contentCommon={contentCommon}
          isAuthenticated={isAuthenticated}
          requiredStep={requiredSteps?.[0]}
          listAnswer={currentListAnswerByUser}
          showExtraQuestion={showExtraQuestion}
          loginModalVisible={loginModalVisible}
          listEQQuestion={currentListEQQuestion}
          indexPageEQTest={dataPage.currentPage}
          contentContainer={contentPage.template}
          amountPageEQTest={handleCountTotalPage()}
          profileLoadingSubmit={profileLoadingSubmit}
          maxQuestionPerEQTestPage={maxQuestionPerEQTestPage}
          facebookProfileUrl={facebookProfileUrl}
          onNext={handleNextEQTestPage}
          onBack={handleBackEQTestPage}
          onSubmit={handleSurveySubmit}
          onTimedOut={handleTimedOut}
          onOpenLoginModal={handleOpenLoginModal}
          onSubmitAnswerExtraQuestion={handleAnswerExtraQuestion}
        />
      )}
      {step === handleCountTotalPage() + 1 && (
        <EQModalFinish contentCommon={contentCommon} contentContainer={contentPage.finish} />
      )}
      {step !== handleCountTotalPage() + 1 && <ProgressBar step={step} amountPageSurvey={handleCountTotalPage()} />}
    </TemplatePage>
  )
}

export default EQTestPage
