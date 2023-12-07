import React, { useState, useEffect, useCallback } from 'react'
import { isEmpty } from 'lodash'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import config from 'configs'
import i18nVN from 'i18n/locales/vn'
import useMergeState from 'hooks/useMergeState'
import { checkForHexRegExp, redirectToWithReplace } from 'utils'
import { getCurrentListGroupQuestion, toastifyNotify, isAnswered } from 'helpers'
import businessManagement from 'assets/images/business-management.svg'
import { editListGroupQuestion, fetchListGroupQuestionIfNeeded } from 'redux/services/groupQuestion'
import { fetchPosition } from 'redux/services/position'
import { updateFacebookProfileUrl } from 'redux/services/profile'
import { handleOpenModalFailure } from 'redux/services/modalError'
import { submitSurvey, submitSurveyWithPosition } from 'redux/services/report'
import Background from 'components/Background'
import GoogleSignIn from 'components/Button/GoogleSignIn'
import AddFacebookProfile from 'components/LoginModal/containers/AddFacebookProfileStep'

import TemplatePage from 'containers/TemplatePage'
import ProgressBar from './components/ProgressBar'
import ModalFinish from './containers/Modal/Finish'
import TemplateSurvey from './containers/TemplateSurvey'
import ModalInstructor from './containers/Modal/Instructor'

import './style.scss'

const SurveyPage = (props) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { position_id: positionId } = props.match.params

  const [facebookProfileInput, setFacebookProfileInput] = useState('')
  const [loginModalVisible, setLoginModalVisible] = useState(false)

  const [position, setPosition] = useState({})
  const [showExtraQuestion, setShowExtraQuestion] = useState(false)
  const [answerExtraQuestion, setAnswerExtraQuestion] = useState([])
  const [requiredSteps, setRequiredSteps] = useState([])
  // Step is current page (instructor page is step 0)
  const [step, setStep] = useState(0)
  const [dataPage, setDataPage] = useMergeState({
    currentPage: 0,
    nextPage: 1,
  })

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  const {
    common: contentCommon,
    pages: { survey: contentPage },
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

  const getPosition = async () => {
    if (!checkForHexRegExp.test(`${positionId}`)) {
      redirectToWithReplace(history, `/${positionId}`)
      return
    }

    await fetchPosition(positionId, setPosition, history, 'report_id')
  }

  // Fetch position if position
  useEffect(() => {
    if (positionId) {
      getPosition()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isEmpty(position) && !position?.category_test?.includes('DISCScore')) {
      redirectToWithReplace(history, '/')
      toastifyNotify('error', 'Position invalid!!!')
      return
    }
  }, [position, history])

  // Get facebook profile url
  const facebookProfileUrl = useSelector((state) => state.profile.profile.facebook_profile_url)

  // Get list group question from redux
  const listGroupQuestionObject = useSelector((state) => state.groupQuestion.listGroupQuestion)

  // Fetch list group question from database
  useEffect(() => {
    dispatch(fetchListGroupQuestionIfNeeded())
    if (!isAuthenticated) {
      setStep(0)
      setDataPage({
        currentPage: 0,
        nextPage: 1,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAuthenticated])

  // Get facebook profile url submitting loading status
  const profileLoadingSubmit = useSelector((state) => state.profile.loadingPut)

  const listGroupQuestion = Object.values(listGroupQuestionObject)

  // Get loading of fetching list group question
  const loadingGetListGroupQuestion = useSelector((state) => state.groupQuestion.loadingGet)

  // Get list group question of current page
  const currentListGroupQuestion = getCurrentListGroupQuestion(
    dataPage.currentPage,
    listGroupQuestion,
    maxGroupQuestionPerSurveyPage,
  )

  // Get Amount of total page
  const handleCountTotalPage = () => {
    return Math.ceil(listGroupQuestion.length / maxGroupQuestionPerSurveyPage)
  }

  /**
   * Handle selecting question answer option
   * @param {number} index question index
   * @param {object} { keyIdQuestion: string; typeAnswer: "most" | "least"; } dataQuestion
   */
  const handleChangeRadio = (index, dataQuestion) => {
    dispatch(editListGroupQuestion(index, dataQuestion))
  }

  const [time, setTime] = useState(0)

  const handleStartSurvey = () => {
    setStep(1)
    setTime(Date.now())
  }

  const handleBackSurveyPage = () => {
    setStep(step - 1)
    setDataPage({
      currentPage: dataPage.currentPage - 1,
      nextPage: dataPage.nextPage - 1,
    })
  }

  // Check current list group question have element which was not answered
  const handleCheckListGroupQuestionWasAnswered = useCallback(
    (listIndexError) => {
      getCurrentListGroupQuestion(dataPage.currentPage, listGroupQuestion, maxGroupQuestionPerSurveyPage).forEach(
        (groupQuestion, inx) => {
          if (!isAnswered(groupQuestion)) {
            listIndexError.push(`Câu hỏi ${5 * dataPage.currentPage + inx + 1}`)
          }
        },
      )
    },
    [dataPage, listGroupQuestion, maxGroupQuestionPerSurveyPage],
  )

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

  const handleSurveySubmitWithPosition = useCallback(
    async (listAnswer) => {
      const testDuration = Math.ceil((Date.now() - time) / 1000)
      dispatch(
        submitSurveyWithPosition(
          () => setStep((prev) => prev + 1),
          listAnswer,
          position,
          answerExtraQuestion,
          testDuration,
        ),
      )
    },
    [answerExtraQuestion, dispatch, position, time],
  )

  const handleSurveySubmit = useCallback(() => {
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

    const listAnswer = listGroupQuestion.map((groupQuestion) => groupQuestion.answer)
    if (JSON.stringify(position) !== '{}') {
      if (!!position?.extra_question?.length && !answerExtraQuestion?.length) {
        setShowExtraQuestion(true)
      } else {
        handleSurveySubmitWithPosition(listAnswer)
      }
    } else {
      const testDuration = Math.ceil((Date.now() - time) / 1000)
      dispatch(submitSurvey(() => setStep((prev) => prev + 1), listAnswer, testDuration))
    }
  }, [
    answerExtraQuestion,
    dispatch,
    facebookProfileUrl,
    handleCheckListGroupQuestionWasAnswered,
    handleSurveySubmitWithPosition,
    listGroupQuestion,
    position,
    time,
  ])

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
      dataPage.currentPage + 1 === Math.ceil(listGroupQuestion.length / maxGroupQuestionPerSurveyPage)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerExtraQuestion, handleCheckListGroupQuestionWasAnswered, handleSurveySubmit])

  return (
    <>
      <Helmet>
        <title>{contentPage.titleTag}</title>
      </Helmet>
      <TemplatePage namePage='survey-page' typeHeader='expand'>
        <Background />
        {step === 0 && (
          <ModalInstructor
            contentCommon={contentCommon}
            loading={loadingGetListGroupQuestion}
            amountPageSurvey={handleCountTotalPage()}
            contentContainer={contentPage.instructor}
            onStartSurvey={handleStartSurvey}
          />
        )}
        {step !== handleCountTotalPage() + 1 && step !== 0 && (
          <TemplateSurvey
            position={position}
            contentCommon={contentCommon}
            isAuthenticated={isAuthenticated}
            requiredStep={requiredSteps?.[0]}
            loginModalVisible={loginModalVisible}
            showExtraQuestion={showExtraQuestion}
            indexPageSurvey={dataPage.currentPage}
            contentContainer={contentPage.template}
            amountPageSurvey={handleCountTotalPage()}
            profileLoadingSubmit={profileLoadingSubmit}
            listGroupQuestion={currentListGroupQuestion}
            maxGroupQuestionPerSurveyPage={maxGroupQuestionPerSurveyPage}
            facebookProfileUrl={facebookProfileUrl}
            onNext={handleNextSurveyPage}
            onBack={handleBackSurveyPage}
            onSubmit={handleSurveySubmit}
            onChangeRadio={handleChangeRadio}
            onOpenLoginModal={handleOpenLoginModal}
            onSubmitAnswerExtraQuestion={handleAnswerExtraQuestion}
          />
        )}
        {!loadingGetListGroupQuestion && (
          <>
            {step === handleCountTotalPage() + 1 && (
              <ModalFinish contentCommon={contentCommon} contentContainer={contentPage.finish} />
            )}
            {step !== handleCountTotalPage() + 1 && (
              <ProgressBar step={step} amountPageSurvey={handleCountTotalPage()} />
            )}
          </>
        )}
      </TemplatePage>
    </>
  )
}

export default SurveyPage
