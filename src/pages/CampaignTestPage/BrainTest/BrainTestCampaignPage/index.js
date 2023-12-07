import './style.scss'
import React, { useRef, useState, useEffect, useCallback } from 'react'
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
} from 'redux/services/brainTestCampaign'
// import { updateCandidateInformation } from 'redux/services/profile'
import { handleOpenModalFailure } from 'redux/services/modalError'
import businessManagement from 'assets/images/business-management.svg'
import Background from 'components/Background'
import GoogleSignIn from 'components/Button/GoogleSignIn'
import { checkForHexRegExp, redirectToWithReplace } from 'utils'
import { fetchPositionCampaign } from 'redux/services/positionCampaign'
import { handleOpenModalTimedOut } from 'redux/services/modalTimedOut'
// import AddInformationProfile from '../../components/AddInformationProfile'
import ProgressBar from './components/ProgressBar'
import TemplateBrainTest from './containers/TemplateBrainTest'
import BrainModalFinish from './containers/LeftRightBrainModal/Finish'
import LeftRightBrainModalInstructor from './containers/LeftRightBrainModal/Instructor'

const BrainTestCampaignPage = (props) => {
  const { campaign_id: campaignId, position_id: positionId } = props.match.params
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  const [loginModalVisible, setLoginModalVisible] = useState(false)
  const [position, setPosition] = useState({})
  const [showSurvey, setShowSurvey] = useState(false)
  const [answerSurvey, setAnswerSurvey] = useState([])
  const [loading, setLoading] = useState(false)
  const [timeByPage, setTimeByPage] = useState([])
  const [cvFile, setCvFile] = useState(null)
  const [coverLetterFile, setCoverLetterFile] = useState(null)

  const startedTime = useRef(null)
  const countTimeByPage = useRef(null)

  const {
    pages: { leftRightBrainTest: contentPage },
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
  const [dataPage, setDataPage] = useMergeState({
    currentPage: 0,
    nextPage: 1,
  })

  const [requiredSteps, setRequiredSteps] = useState([])

  const dispatch = useDispatch()
  const history = useHistory()

  // const profileData = useSelector((state) => state.profile.profile)

  // const { name, sex, phone, facebook_profile_url } = profileData
  // const enoughInformation = [!!name, !!sex, !!phone, !!facebook_profile_url].every(Boolean)

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

    await fetchPositionCampaign(dispatch, campaignId, positionId, 'brain_score', setPosition, setLoading, history)
  }

  // Fetch position if position
  useEffect(() => {
    if (positionId) {
      getPosition()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isEmpty(position) && !position?.category_test?.includes('brain_score')) {
      redirectToWithReplace(history, '/')
      toastifyNotify('error', "There is no Brain Test for this campaign's position!")
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
    window.scroll(0, 0)
    startedTime.current = new Date()
    countTimeByPage.current = new Date()
  }

  const listLRBrainQuestion = Object.values(listLRBrainQuestionObject)

  // Get list group question of current page
  const currentListLRBrainQuestion = getCurrentListQuestion(
    dataPage.currentPage,
    listLRBrainQuestion,
    maxQuestionPerBrainTestPage,
  )

  // Get facebook profile url submitting loading status
  const profileLoadingSubmit = useSelector((state) => state.profile.loadingPut)

  // Amount page from (amount list group question) / (amount question per page), > 5.0 => 6 pages
  const handleCountTotalPage = () => {
    return Math.round(listLRBrainQuestion.length / maxQuestionPerBrainTestPage + 0.4)
  }

  // Check current list group question have element which was not answered
  const handleCheckListGroupQuestionWasAnswered = useCallback(
    (listIndexError) => {
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
    },
    [currentListAnswerByUser, dataPage.currentPage, maxQuestionPerBrainTestPage],
  )

  const handleNextBrainTestPage = () => {
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

  const handleBackBrainTestPage = () => {
    setStep(step - 1)
    setDataPage({
      currentPage: dataPage.currentPage - 1 === -1 ? 0 : dataPage.currentPage - 1,
      nextPage: dataPage.nextPage - 1,
    })
  }

  const handleSurveySubmitWithPosition = useCallback(
    async (listAnswer, timeByPage, finishedTime) => {
      dispatch(
        submitBrainTestWithPosition(
          () => setStep((prev) => prev + 1),
          listAnswer,
          position,
          campaignId,
          answerSurvey,
          cvFile,
          coverLetterFile,
          timeByPage,
          finishedTime,
          listLRBrainQuestion,
        ),
      )
    },
    [answerSurvey, campaignId, coverLetterFile, cvFile, dispatch, position, listLRBrainQuestion],
  )

  const handleSurveySubmit = useCallback(async () => {
    let listIndexError = []
    handleCheckListGroupQuestionWasAnswered(listIndexError)

    if (listIndexError.length) {
      dispatch(handleOpenModalFailure(null, listIndexError))
      return
    }
    // if (
    //   !listIndexError.length
    //   // && !enoughInformation
    // ) {
    //   setLoginModalVisible(true)
    //   return
    // }

    let finishedTime = new Date() - startedTime.current
    let finishedTimeByPage = new Date() - countTimeByPage.current

    const timeByPageList = [...timeByPage, finishedTimeByPage]

    // const showSurveyModal =
    //   [!!position?.survey_brain_score?.questions?.length, !answerSurvey?.length].every(Boolean) ||
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
        submitBrainTest(
          () => setStep((prev) => prev + 1),
          currentListAnswerByUser,
          campaignId,
          positionId,
          timeByPageList,
          finishedTime,
          listLRBrainQuestion,
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
    listLRBrainQuestion,
  ])

  // const handleUpdateCandidateInformation = (values) => {
  //   const submitProfileSuccess = dispatch(updateCandidateInformation(values))
  //   if (submitProfileSuccess) {
  //     setLoginModalVisible(false)
  //   }
  // }

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
      dataPage.currentPage + 1 === Math.ceil(listLRBrainQuestion.length / maxQuestionPerBrainTestPage)
    ) {
      handleSurveySubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [answerSurvey])

  const handleAnswerSurvey = (values) => {
    setCvFile(values?.attach_cv?.file)
    setCoverLetterFile(values?.attach_cover_letter?.file)

    const surveyAnswer = position?.survey_iq_score?.questions?.map((question) => ({
      ...question,
      answer: values[question?._id],
    }))
    setAnswerSurvey(surveyAnswer)

    let finishedTime = new Date() - startedTime.current
    let finishedTimeByPage = new Date() - countTimeByPage.current

    const timeByPageList = [...timeByPage, finishedTimeByPage]

    handleSurveySubmitWithPosition(currentListAnswerByUser, timeByPageList, finishedTime)
  }

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

      dispatch(submitBrainTest(() => {}, currentListAnswerByUser, 0, campaignId, positionId))
      dispatch(
        handleOpenModalTimedOut(answerCount, totalQuestion, `brain-test-campaign-result/${campaignId}/${positionId}`),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    trigger,
    // enoughInformation
  ])

  const handleTimedOut = () => {
    setTrigger(true)
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
            loading={loading}
          />
        )}
        {step !== handleCountTotalPage() + 1 && step !== 0 && (
          <TemplateBrainTest
            position={position}
            contentCommon={contentCommon}
            requiredStep={requiredSteps?.[0]}
            isAuthenticated={isAuthenticated}
            listAnswer={currentListAnswerByUser}
            showSurvey={showSurvey}
            loginModalVisible={loginModalVisible}
            contentContainer={contentPage.template}
            indexPageBrainTest={dataPage.currentPage}
            profileLoadingSubmit={profileLoadingSubmit}
            amountPageBrainTest={handleCountTotalPage()}
            listLRBrainQuestion={currentListLRBrainQuestion}
            maxQuestionPerBrainTestPage={maxQuestionPerBrainTestPage}
            survey={position?.survey_brain_score?.questions}
            onSubmit={handleSurveySubmit}
            onNext={handleNextBrainTestPage}
            onBack={handleBackBrainTestPage}
            onOpenLoginModal={handleOpenLoginModal}
            onSubmitAnswerSurvey={handleAnswerSurvey}
            onTimedOut={handleTimedOut}
          />
        )}
        {step === handleCountTotalPage() + 1 && (
          <BrainModalFinish
            contentCommon={contentCommon}
            contentContainer={contentPage.finish}
            campaignId={campaignId}
            positionId={positionId}
          />
        )}
        {step !== handleCountTotalPage() + 1 && <ProgressBar step={step} amountPageSurvey={handleCountTotalPage()} />}
      </TemplatePage>
    </>
  )
}

export default BrainTestCampaignPage
