import './style.scss'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { isEmpty } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import config from 'configs'
import i18nVN from 'i18n/locales/vn'
import { getCurrentListQuestion, toastifyNotify } from 'helpers'
import useMergeState from 'hooks/useMergeState'
import TemplatePage from 'containers/TemplatePage'
import { submitEQTest, fetchListEQQuestionIfNeeded, submitEQTestWithPosition } from 'redux/services/EQTestCampaign'
import { handleOpenModalFailure } from 'redux/services/modalError'
import { handleOpenModalTimedOut } from 'redux/services/modalTimedOut'
import businessManagement from 'assets/images/business-management.svg'
import Background from 'components/Background'
import GoogleSignIn from 'components/Button/GoogleSignIn'
import { checkForHexRegExp, redirectToWithReplace } from 'utils'
import { fetchPositionCampaign } from 'redux/services/positionCampaign'
// import { updateCandidateInformation } from 'redux/services/profile'
// import AddInformationProfile from '../../components/AddInformationProfile'
import ProgressBar from './components/ProgressBar'
import EQModalFinish from './containers/EQModal/Finish'
import TemplateEQTest from './containers/TemplateEQTest'
import EQModalInstructor from './containers/EQModal/Instructor'

const EQTestCampaignPage = (props) => {
  const {
    pages: { eqTest: contentPage },
    common: contentCommon,
  } = i18nVN.src

  const {
    pages: {
      signup: { loginModal: loginContent },
    },
  } = i18nVN.src

  // const {
  //   pages: {
  //     signup: { updateProfileModal: updateProfileContent },
  //   },
  // } = i18nVN.src

  // Step is current page (instructor page is step 0)
  const [step, setStep] = useState(0)

  const { campaign_id: campaignId, position_id: positionId } = props.match.params
  const [loginModalVisible, setLoginModalVisible] = useState(false)
  const [showSurvey, setShowSurvey] = useState(false)
  const [answerSurvey, setAnswerSurvey] = useState([])
  const [position, setPosition] = useState({})
  const [loading, setLoading] = useState(false)
  const [timeByPage, setTimeByPage] = useState([])
  const [cvFile, setCvFile] = useState(null)
  const [coverLetterFile, setCoverLetterFile] = useState(null)

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const startedTime = useRef(null)
  const countTimeByPage = useRef(null)

  const [dataPage, setDataPage] = useMergeState({
    currentPage: 0,
    nextPage: 1,
  })

  const [requiredSteps, setRequiredSteps] = useState([])

  const dispatch = useDispatch()
  const history = useHistory()

  // Get list EQ answer chosen by user
  const listAnswerByUser = useSelector((state) => state.EQTest.listEQAnswer)

  // Get facebook profile url submitting loading status
  const profileLoadingSubmit = useSelector((state) => state.profile.loadingPut)

  const currentListAnswerByUser = Object.values(listAnswerByUser)

  const listEQQuestionObject = useSelector((state) => state.EQTest.listEQQuestion)

  // const profileData = useSelector((state) => state.profile.profile)

  // const { name, sex, phone, facebook_profile_url } = profileData
  // const enoughInformation = [!!name, !!sex, !!phone, !!facebook_profile_url].every(Boolean)

  // Get amount question per page
  const { maxQuestionPerEQTestPage } = config

  const listEQQuestion = Object.values(listEQQuestionObject)

  // Get list question of current page
  const currentListEQQuestion = getCurrentListQuestion(dataPage.currentPage, listEQQuestion, maxQuestionPerEQTestPage)

  const getPosition = async () => {
    if (!checkForHexRegExp.test(`${positionId}`)) {
      redirectToWithReplace(history, `/${campaignId}/${positionId}`)
      return
    }

    await fetchPositionCampaign(dispatch, campaignId, positionId, 'eq_score', setPosition, setLoading, history)
  }

  // Fetch position if position
  useEffect(() => {
    if (positionId) {
      getPosition()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isEmpty(position) && !position?.category_test?.includes('eq_score')) {
      redirectToWithReplace(history, '/')
      toastifyNotify('error', "There is no EQ Test for this campaign's position!")
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
    countTimeByPage.current = new Date()
  }, [])

  // Amount page from (amount list group question) / (amount question per page), > 5.0 => 6 pages
  const handleCountTotalPage = () => {
    return Math.round(listEQQuestion.length / maxQuestionPerEQTestPage + 0.4)
  }

  // Check current list group question have element which was not answered
  const handleCheckListGroupQuestionWasAnswered = useCallback(
    (listIndexError) => {
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
    },
    [currentListAnswerByUser, dataPage.currentPage, maxQuestionPerEQTestPage],
  )

  const handleNextEQTestPage = () => {
    let listIndexError = []
    handleCheckListGroupQuestionWasAnswered(listIndexError)

    if (listIndexError?.length === 0) {
      let finishedTimeByPage = new Date() - countTimeByPage.current

      setTimeByPage([...timeByPage, finishedTimeByPage])
      countTimeByPage.current = new Date()
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
    async (listAnswer, timeByPage, finishedTime) => {
      dispatch(
        submitEQTestWithPosition(
          () => setStep((prev) => prev + 1),
          listAnswer,
          position,
          campaignId,
          answerSurvey,
          cvFile,
          coverLetterFile,
          timeByPage,
          finishedTime,
        ),
      )
    },
    [answerSurvey, campaignId, coverLetterFile, cvFile, dispatch, position],
  )

  const handleSurveySubmit = useCallback(async () => {
    let listIndexError = []
    handleCheckListGroupQuestionWasAnswered(listIndexError)

    if (listIndexError.length) {
      dispatch(handleOpenModalFailure(null, listIndexError))
      return
    }
    // if (!listIndexError?.length && !enoughInformation) {
    //   setLoginModalVisible(true)
    //   return
    // }

    let finishedTime = new Date() - startedTime.current
    let finishedTimeByPage = new Date() - countTimeByPage.current

    const timeByPageList = [...timeByPage, finishedTimeByPage]

    // const showSurveyModal =
    //   [!!position?.survey_eq_score?.questions?.length, !answerSurvey?.length].every(Boolean) ||
    //   [!!position?.upload_test?.length, isShowModal].every(Boolean)

    if (JSON.stringify(position) !== '{}') {
      // if (showSurveyModal) {
      //   setShowSurvey(true)
      // } else {
      //   handleSurveySubmitWithPosition(currentListAnswerByUser, timeByPageList, finishedTime)
      // }
      setShowSurvey(true)
    } else {
      dispatch(
        submitEQTest(
          () => setStep((prev) => prev + 1),
          currentListAnswerByUser,
          campaignId,
          positionId,
          timeByPageList,
          finishedTime,
        ),
      )
    }
  }, [
    handleCheckListGroupQuestionWasAnswered,
    timeByPage,
    position,
    dispatch,
    currentListAnswerByUser,
    campaignId,
    positionId,
  ])

  const [trigger, setTrigger] = useState(false)
  useEffect(() => {
    if (trigger) {
      // if (!enoughInformation) {
      //   setLoginModalVisible(true)
      //   return
      // }
      let answerCount = 0,
        totalQuestion = 0
      currentListAnswerByUser.forEach((answer) => {
        if (answer !== null) {
          answerCount++
        }
      })
      totalQuestion = currentListAnswerByUser.length

      dispatch(submitEQTest(() => {}, currentListAnswerByUser, 0, campaignId, positionId))
      dispatch(
        handleOpenModalTimedOut(answerCount, totalQuestion, `eq-test-campaign-result/${campaignId}/${positionId}`),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    trigger,
    // , enoughInformation
  ])

  const handleTimedOut = () => {
    setTrigger(true)
  }

  // const handleUpdateCandidateInformation = (values) => {
  //   const submitProfileSuccess = dispatch(updateCandidateInformation(values))
  //   if (submitProfileSuccess) {
  //     setLoginModalVisible(false)
  //   }
  // }

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
    // if (!enoughInformation) {
    //   steps.push({
    //     imgSrc: businessManagement,
    //     title: updateProfileContent.title,
    //     description: updateProfileContent.description,
    //     action: <AddInformationProfile loading={profileLoadingSubmit} onClick={handleUpdateCandidateInformation} />,
    //   })
    // }

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
  }, [
    isAuthenticated,
    // enoughInformation,
    profileLoadingSubmit,
    dataPage.currentPage,
  ])

  // useEffect(() => {
  //   let listIndexError = []
  //   handleCheckListGroupQuestionWasAnswered(listIndexError)
  //   if ((answerSurvey?.length && !listIndexError.length) || (position?.upload_test?.length && !listIndexError.length)) {
  //     handleSurveySubmit()
  //   }
  // }, [answerSurvey])

  const handleOpenLoginModal = () => {
    if (trigger) return
    setLoginModalVisible((prev) => !prev)
  }

  const handleAnswerSurvey = (values) => {
    setCvFile(values?.attach_cv?.file)
    setCoverLetterFile(values?.attach_cover_letter?.file)

    const surveyAnswer = position?.survey_eq_score?.questions?.map((question) => ({
      ...question,
      answer: values[question?._id],
    }))

    setAnswerSurvey(surveyAnswer)

    let finishedTime = new Date() - startedTime.current
    let finishedTimeByPage = new Date() - countTimeByPage.current

    const timeByPageList = [...timeByPage, finishedTimeByPage]

    handleSurveySubmitWithPosition(currentListAnswerByUser, timeByPageList, finishedTime)
  }
  return (
    <TemplatePage namePage='survey-page' typeHeader='expand'>
      <Background />
      {step === 0 && (
        <EQModalInstructor
          amountPageSurvey={handleCountTotalPage()}
          contentContainer={contentPage.instructor}
          onStartSurvey={handleStartEQTest}
          loading={loading}
        />
      )}
      {step !== handleCountTotalPage() + 1 && step !== 0 && (
        <TemplateEQTest
          position={position}
          contentCommon={contentCommon}
          isAuthenticated={isAuthenticated}
          requiredStep={requiredSteps?.[0]}
          listAnswer={currentListAnswerByUser}
          showSurveyQuestion={showSurvey}
          loginModalVisible={loginModalVisible}
          listEQQuestion={currentListEQQuestion}
          indexPageEQTest={dataPage.currentPage}
          contentContainer={contentPage.template}
          amountPageEQTest={handleCountTotalPage()}
          profileLoadingSubmit={profileLoadingSubmit}
          maxQuestionPerEQTestPage={maxQuestionPerEQTestPage}
          survey={position?.survey_eq_score?.questions}
          onNext={handleNextEQTestPage}
          onBack={handleBackEQTestPage}
          onSubmit={handleSurveySubmit}
          onTimedOut={handleTimedOut}
          onOpenLoginModal={handleOpenLoginModal}
          onSubmitAnswerSurvey={handleAnswerSurvey}
        />
      )}
      {step === handleCountTotalPage() + 1 && (
        <EQModalFinish
          contentCommon={contentCommon}
          contentContainer={contentPage.finish}
          campaignId={campaignId}
          positionId={positionId}
        />
      )}
      {step !== handleCountTotalPage() + 1 && <ProgressBar step={step} amountPageSurvey={handleCountTotalPage()} />}
    </TemplatePage>
  )
}

export default EQTestCampaignPage
