import React, { useState, useEffect, useCallback } from 'react'
import { isEmpty } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import config from 'configs'
import i18nVN from 'i18n/locales/vn'
import useMergeState from 'hooks/useMergeState'
import { getCurrentListQuestion, toastifyNotify } from 'helpers'
import TemplatePage from 'containers/TemplatePage'
import {
  fetchListLRBrainQuestionIfNeeded,
  submitBrainTest,
  submitBrainTestWithPosition,
} from 'redux/services/brainTest'
import { updateFacebookProfileUrl } from 'redux/services/profile'
import { handleOpenModalFailure } from 'redux/services/modalError'
import businessManagement from 'assets/images/business-management.svg'
import Background from 'components/Background'
import GoogleSignIn from 'components/Button/GoogleSignIn'
import AddFacebookProfile from 'components/LoginModal/containers/AddFacebookProfileStep'
import { checkForHexRegExp, redirectToWithReplace } from 'utils'
import { fetchPosition } from 'redux/services/position'

import ProgressBar from './components/ProgressBar'
import TemplateBrainTest from './containers/TemplateBrainTest'
import BrainModalFinish from './containers/LeftRightBrainModal/Finish'
import LeftRightBrainModalInstructor from './containers/LeftRightBrainModal/Instructor'

import './style.scss'

const LeftRightBrainTestPage = (props) => {
  const [facebookProfileInput, setFacebookProfileInput] = useState('')
  const [loginModalVisible, setLoginModalVisible] = useState(false)
  const [position, setPosition] = useState({})
  const [showExtraQuestion, setShowExtraQuestion] = useState(false)
  const [answerExtraQuestion, setAnswerExtraQuestion] = useState([])
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const { position_id: positionId } = props.match.params

  const {
    pages: { leftRightBrainTest: contentPage },
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
  const [dataPage, setDataPage] = useMergeState({
    currentPage: 0,
    nextPage: 1,
  })

  const [requiredSteps, setRequiredSteps] = useState([])

  const dispatch = useDispatch()
  const history = useHistory()

  // Get amount group question per page
  const { maxQuestionPerBrainTestPage } = config

  // Get list answer choose by user
  const listAnswerByUser = useSelector((state) => state.brainTest.listAnswer)
  const currentListAnswerByUser = Object.values(listAnswerByUser)

  // Get list group question from redux
  const listLRBrainQuestionObject = useSelector((state) => state.brainTest.listLRBrainQuestion)

  const getPosition = async () => {
    if (!checkForHexRegExp.test(`${positionId}`)) {
      redirectToWithReplace(history, `/${positionId}`)
      return
    }

    await fetchPosition(positionId, setPosition, history, 'brain_score_id')
  }

  // Fetch position if position
  useEffect(() => {
    if (positionId) {
      getPosition()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isEmpty(position) && !position?.category_test?.includes('BrainScore')) {
      redirectToWithReplace(history, '/')
      toastifyNotify('error', 'Position is invalid!!!')
      return
    }
  }, [position, history])

  // Fetch list group question from database
  useEffect(() => {
    dispatch(fetchListLRBrainQuestionIfNeeded())
    setStep(0)
    setDataPage({
      currentPage: 0,
      nextPage: 1,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, listLRBrainQuestionObject])

  const handleStartBrainTest = () => {
    setStep(1)
    setTime(Date.now())
  }

  const listLRBrainQuestion = Object.values(listLRBrainQuestionObject)

  // Get list group question of current page
  const currentListLRBrainQuestion = getCurrentListQuestion(
    dataPage.currentPage,
    listLRBrainQuestion,
    maxQuestionPerBrainTestPage,
  )

  // Get facebook profile url
  const facebookProfileUrl = useSelector((state) => state.profile.profile.facebook_profile_url)

  // Get facebook profile url submitting loading status
  const profileLoadingSubmit = useSelector((state) => state.profile.loadingPut)

  // Amount page from (amount list group question) / (amount question per page), > 5.0 => 6 pages
  const handleCountTotalPage = () => {
    return Math.round(listLRBrainQuestion.length / maxQuestionPerBrainTestPage + 0.4)
  }

  // Check current list group question have element which was not answered
  const handleCheckListGroupQuestionWasAnswered = (listIndexError) => {
    const listAnswerByUserAtCurrentPage = getCurrentListQuestion(
      dataPage.currentPage,
      Object.entries(currentListAnswerByUser),
      maxQuestionPerBrainTestPage,
    )

    listAnswerByUserAtCurrentPage.forEach((answer, inx) => {
      if (answer[1] === null) {
        listIndexError.push(`Câu ${maxQuestionPerBrainTestPage * dataPage.currentPage + inx + 1}`)
      }
    })
  }

  const handleNextBrainTestPage = () => {
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

  const handleBackBrainTestPage = () => {
    setStep(step - 1)
    setDataPage({
      currentPage: dataPage.currentPage - 1 === -1 ? 0 : dataPage.currentPage - 1,
      nextPage: dataPage.nextPage - 1,
    })
  }

  const handleSurveySubmitWithPosition = useCallback(
    async (listAnswer, testDuration) => {
      dispatch(
        submitBrainTestWithPosition(
          () => setStep((prev) => prev + 1),
          listAnswer,
          position,
          answerExtraQuestion,
          testDuration,
          listLRBrainQuestion,
        ),
      )
    },
    [answerExtraQuestion, dispatch, position, listLRBrainQuestion],
  )

  const [time, setTime] = useState(0)

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
      if (!!position?.extra_question?.length && !answerExtraQuestion?.length) {
        setShowExtraQuestion(true)
      } else {
        const testDuration = Math.ceil((Date.now() - time) / 1000)
        handleSurveySubmitWithPosition(currentListAnswerByUser, testDuration)
      }
    } else {
      const testDuration = Math.ceil((Date.now() - time) / 1000)
      dispatch(
        submitBrainTest(() => setStep((prev) => prev + 1), currentListAnswerByUser, testDuration, listLRBrainQuestion),
      )
    }
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

  const handleFacebookProfileInputBlur = useCallback((e) => setFacebookProfileInput(e.target.value), [])

  const handleOpenLoginModal = () => {
    setLoginModalVisible((prev) => !prev)
  }

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
      dataPage.currentPage + 1 === Math.ceil(listLRBrainQuestion.length / maxQuestionPerBrainTestPage)
    ) {
      handleSurveySubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, facebookProfileUrl, facebookProfileInput, profileLoadingSubmit, dataPage.currentPage])

  useEffect(() => {
    let listIndexError = []
    handleCheckListGroupQuestionWasAnswered(listIndexError)
    if (answerExtraQuestion.length && !listIndexError.length) {
      handleSurveySubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerExtraQuestion])

  const handleAnswerExtraQuestion = (e) => {
    setAnswerExtraQuestion(e.answerExtraQuestion)
  }

  return (
    <>
      <TemplatePage namePage='survey-page' typeHeader='expand'>
        <Background />
        {step === 0 && (
          <LeftRightBrainModalInstructor
            amountPageSurvey={handleCountTotalPage()}
            contentContainer={contentPage.instructor}
            onStartSurvey={handleStartBrainTest}
          />
        )}
        {step !== handleCountTotalPage() + 1 && step !== 0 && (
          <TemplateBrainTest
            position={position}
            contentCommon={contentCommon}
            requiredStep={requiredSteps?.[0]}
            isAuthenticated={isAuthenticated}
            listAnswer={currentListAnswerByUser}
            showExtraQuestion={showExtraQuestion}
            loginModalVisible={loginModalVisible}
            contentContainer={contentPage.template}
            indexPageBrainTest={dataPage.currentPage}
            profileLoadingSubmit={profileLoadingSubmit}
            amountPageBrainTest={handleCountTotalPage()}
            listLRBrainQuestion={currentListLRBrainQuestion}
            maxQuestionPerBrainTestPage={maxQuestionPerBrainTestPage}
            facebookProfileUrl={facebookProfileUrl}
            onSubmit={handleSurveySubmit}
            onNext={handleNextBrainTestPage}
            onBack={handleBackBrainTestPage}
            onOpenLoginModal={handleOpenLoginModal}
            onSubmitAnswerExtraQuestion={handleAnswerExtraQuestion}
          />
        )}
        {step === handleCountTotalPage() + 1 && (
          <BrainModalFinish contentCommon={contentCommon} contentContainer={contentPage.finish} />
        )}
        {step !== handleCountTotalPage() + 1 && <ProgressBar step={step} amountPageSurvey={handleCountTotalPage()} />}
      </TemplatePage>
    </>
  )
}

export default LeftRightBrainTestPage
