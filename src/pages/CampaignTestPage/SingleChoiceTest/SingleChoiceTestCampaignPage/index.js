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
import { submitSingleChoiceTest, submitSingleChoiceTestWithPosition } from 'redux/services/singleChoiceTestCampaign'
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
import SingleChoiceModalFinish from './containers/SingleChoiceModal/Finish'
import TemplateSingleChoiceTest from './containers/TemplateSingleChoiceTest'
import SingleChoiceModalInstructor from './containers/SingleChoiceModal/Instructor'

const SingleChoiceTestCampaignPage = (props) => {
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
  const [showAdditionalQuestion, setShowAdditionalQuestion] = useState(false)
  const [answerAdditionalQuestion, setAnswerAdditionalQuestion] = useState([])
  const [position, setPosition] = useState({})
  const [loading, setLoading] = useState(false)
  const [timeByPage, setTimeByPage] = useState([])
  const [cvFile, setCvFile] = useState(null)
  const [coverLetterFile, setCoverLetterFile] = useState(null)
  const [isShowModal, setShowModal] = useState(true)

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
  const listAnswerByUser = useSelector((state) => state.singleChoiceTest.listSingleChoiceAnswer)

  // Get facebook profile url submitting loading status
  const profileLoadingSubmit = useSelector((state) => state.profile.loadingPut)

  const currentListAnswerByUser = Object.values(listAnswerByUser)

  const listSingleChoiceQuestionObject = useSelector((state) => state.singleChoiceTest.listSingleChoiceQuestion)

  // const profileData = useSelector((state) => state.profile.profile)

  // const { name, sex, phone, facebook_profile_url } = profileData
  // const enoughInformation = [!!name, !!sex, !!phone, !!facebook_profile_url].every(Boolean)

  // Get amount question per page
  const { maxQuestionPerSingleChoiceTestPage } = config

  const listSingleChoiceQuestion = Object.values(listSingleChoiceQuestionObject)

  // Get list question of current page
  const currentListSingleChoiceQuestion = getCurrentListQuestion(
    dataPage.currentPage,
    listSingleChoiceQuestion,
    maxQuestionPerSingleChoiceTestPage,
  )

  const getPosition = async () => {
    if (!checkForHexRegExp.test(`${positionId}`)) {
      redirectToWithReplace(history, `/${campaignId}/${positionId}`)
      return
    }

    await fetchPositionCampaign(
      dispatch,
      campaignId,
      positionId,
      'single_choice_score',
      setPosition,
      setLoading,
      history,
    )
  }

  // Fetch position if position
  useEffect(() => {
    if (positionId) {
      getPosition()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isEmpty(position) && !position?.category_test?.includes('single_choice_score')) {
      redirectToWithReplace(history, '/')
      toastifyNotify('error', "There is no EQ Test for this campaign's position!")
      return
    }
  }, [position, history])

  // Fetch list question from database
  useEffect(() => {
    setStep(0)
    setDataPage({
      currentPage: 0,
      nextPage: 1,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, listSingleChoiceQuestionObject])

  const handleStartEQTest = useCallback(() => {
    setStep(1)
    window.scroll(0, 0)
    startedTime.current = new Date()
    countTimeByPage.current = new Date()
  }, [])

  // Amount page from (amount list group question) / (amount question per page), > 5.0 => 6 pages
  const handleCountTotalPage = () => {
    return Math.round(listSingleChoiceQuestion.length / maxQuestionPerSingleChoiceTestPage + 0.4)
  }

  // Check current list group question have element which was not answered
  const handleCheckListGroupQuestionWasAnswered = useCallback(
    (listIndexError) => {
      const listAnswerByUserAtCurrentPage = getCurrentListQuestion(
        dataPage.currentPage,
        Object.entries(currentListAnswerByUser),
        maxQuestionPerSingleChoiceTestPage,
      )

      listAnswerByUserAtCurrentPage.forEach((answer, inx) => {
        if (answer[1] === null) {
          listIndexError.push(`Câu ${maxQuestionPerSingleChoiceTestPage * dataPage.currentPage + inx + 1}`)
        }
      })
    },
    [currentListAnswerByUser, dataPage.currentPage, maxQuestionPerSingleChoiceTestPage],
  )

  const handleNextSingleChoiceTestPage = () => {
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

  const handleBackSingleChoiceTestPage = () => {
    setStep(step - 1)
    setDataPage({
      currentPage: dataPage.currentPage - 1 === -1 ? 0 : dataPage.currentPage - 1,
      nextPage: dataPage.nextPage - 1,
    })
  }

  const handleSurveySubmitWithPosition = useCallback(
    async (listAnswer, timeByPage, finishedTime) => {
      dispatch(
        submitSingleChoiceTestWithPosition(
          () => setStep((prev) => prev + 1),
          listAnswer,
          position,
          campaignId,
          answerAdditionalQuestion,
          cvFile,
          coverLetterFile,
          timeByPage,
          finishedTime,
        ),
      )
    },
    [answerAdditionalQuestion, campaignId, coverLetterFile, cvFile, dispatch, position],
  )

  const handleSurveySubmit = useCallback(async () => {
    let listIndexError = []
    handleCheckListGroupQuestionWasAnswered(listIndexError)

    if (listIndexError?.length) {
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

    const showAdditionalModal =
      [!!position?.additional_questions?.length, !answerAdditionalQuestion?.length].every(Boolean) ||
      [!!position?.upload_test?.length, isShowModal].every(Boolean)

    if (JSON.stringify(position) !== '{}') {
      if (showAdditionalModal) {
        setShowAdditionalQuestion(true)
      } else {
        handleSurveySubmitWithPosition(currentListAnswerByUser, timeByPageList, finishedTime)
      }
    } else {
      dispatch(
        submitSingleChoiceTest(
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
    // enoughInformation,
    timeByPage,
    position,
    answerAdditionalQuestion,
    isShowModal,
    dispatch,
    handleSurveySubmitWithPosition,
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

      let finishedTime = new Date() - startedTime.current

      dispatch(
        submitSingleChoiceTestWithPosition(
          () => setStep((prev) => prev + 1),
          currentListAnswerByUser,
          position,
          campaignId,
          answerAdditionalQuestion,
          cvFile,
          coverLetterFile,
          timeByPage,
          finishedTime,
        ),
      )
      dispatch(
        handleOpenModalTimedOut(
          answerCount,
          totalQuestion,
          `single-choice-test-campaign-result/${campaignId}/${positionId}`,
        ),
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
      dataPage.currentPage + 1 === Math.ceil(listSingleChoiceQuestion.length / maxQuestionPerSingleChoiceTestPage)
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

  useEffect(() => {
    let listIndexError = []
    handleCheckListGroupQuestionWasAnswered(listIndexError)
    if (
      (answerAdditionalQuestion.length && !listIndexError.length) ||
      (position?.upload_test?.length && !listIndexError.length)
    ) {
      handleSurveySubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerAdditionalQuestion])

  const handleOpenLoginModal = () => {
    if (trigger) return
    setLoginModalVisible((prev) => !prev)
  }

  const handleAnswerAdditionalQuestion = (values) => {
    setCvFile(values?.attach_cv?.file)
    setCoverLetterFile(values?.attach_cover_letter?.file)
    setShowModal(false)

    const additionalAnswer = position?.additional_questions.map((question) => ({
      ...question,
      answer: values[question?._id],
    }))
    setAnswerAdditionalQuestion(additionalAnswer)
  }

  return (
    <TemplatePage namePage='survey-page' typeHeader='expand' reWork={false}>
      <Background />
      {step === 0 && (
        <SingleChoiceModalInstructor
          position={position}
          amountPageSurvey={handleCountTotalPage()}
          contentContainer={contentPage.instructor}
          onStartSurvey={handleStartEQTest}
          loading={loading}
        />
      )}
      {step !== handleCountTotalPage() + 1 && step !== 0 && (
        <TemplateSingleChoiceTest
          position={position}
          contentCommon={contentCommon}
          isAuthenticated={isAuthenticated}
          requiredStep={requiredSteps?.[0]}
          listAnswer={currentListAnswerByUser}
          showAdditionalQuestion={showAdditionalQuestion}
          loginModalVisible={loginModalVisible}
          listSingleChoiceQuestion={currentListSingleChoiceQuestion}
          indexPageSingleChoiceTest={dataPage.currentPage}
          contentContainer={contentPage.template}
          amountPageSingleChoiceTest={handleCountTotalPage()}
          profileLoadingSubmit={profileLoadingSubmit}
          maxQuestionPerSingleChoiceTestPage={maxQuestionPerSingleChoiceTestPage}
          onNext={handleNextSingleChoiceTestPage}
          onBack={handleBackSingleChoiceTestPage}
          onSubmit={handleSurveySubmit}
          onTimedOut={handleTimedOut}
          onOpenLoginModal={handleOpenLoginModal}
          onSubmitAnswerAdditionalQuestion={handleAnswerAdditionalQuestion}
        />
      )}
      {step === handleCountTotalPage() + 1 && (
        <SingleChoiceModalFinish
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

export default SingleChoiceTestCampaignPage
