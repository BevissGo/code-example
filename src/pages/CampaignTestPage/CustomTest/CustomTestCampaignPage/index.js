import React, { useState, useEffect, useCallback, useRef } from 'react'
import { isEmpty } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import config from 'configs'
import i18nVN from 'i18n/locales/vn'
import { getCurrentListQuestion, toastifyNotify } from 'helpers'
import useMergeState from 'hooks/useMergeState'
import TemplatePage from 'containers/TemplatePage'
import { handleOpenModalFailure } from 'redux/services/modalError'
import { handleOpenModalTimedOut } from 'redux/services/modalTimedOut'
import { submitCustomTest, submitCustomTestWithPosition } from 'redux/services/customTestCampaign'
import businessManagement from 'assets/images/business-management.svg'
import Background from 'components/Background'
import GoogleSignIn from 'components/Button/GoogleSignIn'
import { checkForHexRegExp, redirectToWithReplace } from 'utils'
import { fetchPositionCampaign } from 'redux/services/positionCampaign'
// import { updateCandidateInformation } from 'redux/services/profile'

// import AddInformationProfile from '../../components/AddInformationProfile'

import ProgressBar from './components/ProgressBar'
import TemplateCustomTest from './containers/TemplateCustomTest'
import CustomTestModalFinish from './containers/CustomTestModal/Finish'
import CustomTestModalInstructor from './containers/CustomTestModal/Instructor'
import './style.scss'

const CustomTestCampaignPage = (props) => {
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
  //     // signup: { updateProfileModal: updateProfileContent },
  //   },
  // } = i18nVN.src

  // Step is current page (instructor page is step 0)
  const [step, setStep] = useState(0)

  const { campaign_id: campaignId, position_id: positionId, test_id: testId } = props.match.params
  const [loginModalVisible, setLoginModalVisible] = useState(false)
  const [showSurvey, setShowSurvey] = useState(false)
  const [answerSurveyQuestion, setAnswerSurveyQuestion] = useState([])
  const [position, setPosition] = useState({})
  const [loading, setLoading] = useState(false)
  const [timeByPage, setTimeByPage] = useState([])
  const [cvFile, setCvFile] = useState(null)
  const [coverLetterFile, setCoverLetterFile] = useState(null)
  const [test, setTest] = useState()
  const [listCustomTestQuestion, setListCustomTestQuestion] = useState([])

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

  // Get list custom test answer chosen by user
  const listAnswerByUser = useSelector((state) => state.customTest.listCustomTestAnswer)

  // Get facebook profile url submitting loading status
  const profileLoadingSubmit = useSelector((state) => state.profile.loadingPut)

  const currentListAnswerCorrectByUser = Object.values(listAnswerByUser).filter((e) => typeof e === 'boolean')
  const currentListAnswerByUser = Object.values(listAnswerByUser).filter((e) => typeof e !== 'boolean')

  // const listCustomTestQuestionObject = useSelector((state) => state.customTest.listCustomTestQuestion)

  // const profileData = useSelector((state) => state.profile.profile)

  // const { name, sex, phone, facebook_profile_url } = profileData
  // const enoughInformation = [!!name, !!sex, !!phone, !!facebook_profile_url].every(Boolean)

  // Get amount question per page
  const { maxQuestionPerCustomTestPage } = config

  // const listCustomTestQuestion = Object.values(listCustomTestQuestionObject)

  // Get list question of current page
  const currentListCustomTestQuestion = getCurrentListQuestion(
    dataPage.currentPage,
    listCustomTestQuestion,
    maxQuestionPerCustomTestPage,
  )

  const getPosition = async () => {
    if (!checkForHexRegExp.test(`${positionId}`)) {
      redirectToWithReplace(history, `/${campaignId}/${positionId}`)
      return
    }

    await fetchPositionCampaign(dispatch, campaignId, positionId, 'custom_test_score', setPosition, setLoading, history)
  }
  // Fetch position if position
  useEffect(() => {
    if (positionId) {
      getPosition()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const test = position?.test_list?.find((e) => e.test_id._id === testId)

    setTest(test)
  }, [position, testId])

  useEffect(() => {
    setListCustomTestQuestion(test?.test_id?.question_list)
  }, [test])

  useEffect(() => {
    if (
      !isEmpty(position) &&
      !position?.test_list?.some((e) => {
        return e.test_id._id === testId
      })
    ) {
      redirectToWithReplace(history, '/')
      toastifyNotify('error', "There is no this test for this campaign's position!")
      return
    }
  }, [position, history, testId])

  // Fetch list question from database
  useEffect(() => {
    setStep(0)
    setDataPage({
      currentPage: 0,
      nextPage: 1,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const handleStartCustomTest = useCallback(() => {
    setStep(1)
    window.scroll(0, 0)
    startedTime.current = new Date()
    countTimeByPage.current = new Date()
  }, [])

  // Amount page from (amount list group question) / (amount question per page), > 5.0 => 6 pages
  const handleCountTotalPage = () => {
    return Math.round(listCustomTestQuestion?.length / maxQuestionPerCustomTestPage + 0.4)
  }

  // Check current list group question have element which was not answered
  const handleCheckListGroupQuestionWasAnswered = useCallback(
    (listIndexError) => {
      const listAnswerByUserAtCurrentPage = getCurrentListQuestion(
        dataPage.currentPage,
        Object.entries(currentListAnswerCorrectByUser),
        maxQuestionPerCustomTestPage,
      )

      listAnswerByUserAtCurrentPage.forEach((answer, inx) => {
        if (answer[1] === null) {
          listIndexError.push(`Câu ${maxQuestionPerCustomTestPage * dataPage.currentPage + inx + 1}`)
        }
      })
    },
    [currentListAnswerCorrectByUser, dataPage.currentPage, maxQuestionPerCustomTestPage],
  )
  const handleNextCustomTestPage = () => {
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

  const handleBackCustomTestPage = () => {
    setStep(step - 1)
    setDataPage({
      currentPage: dataPage.currentPage - 1 === -1 ? 0 : dataPage.currentPage - 1,
      nextPage: dataPage.nextPage - 1,
    })
  }

  const handleSurveySubmitWithPosition = useCallback(
    async (listAnswer, timeByPage, finishedTime) => {
      dispatch(
        submitCustomTestWithPosition(
          () => setStep((prev) => prev + 1),
          listAnswer,
          position,
          campaignId,
          test._id,
          answerSurveyQuestion,
          cvFile,
          coverLetterFile,
          timeByPage,
          finishedTime,
          listCustomTestQuestion,
          currentListAnswerByUser,
        ),
      )
    },
    [
      answerSurveyQuestion,
      campaignId,
      coverLetterFile,
      cvFile,
      dispatch,
      position,
      test,
      listCustomTestQuestion,
      currentListAnswerByUser,
    ],
  )

  const handleSurveySubmit = useCallback(async () => {
    let listIndexError = []
    handleCheckListGroupQuestionWasAnswered(listIndexError)

    if (listIndexError?.length) {
      dispatch(handleOpenModalFailure(null, listIndexError))
      return
    }
    // if (!listIndexError?.length
    //   // && !enoughInformation
    //   ) {
    //   setLoginModalVisible(true)
    //   return
    // }

    let finishedTime = new Date() - startedTime.current
    let finishedTimeByPage = new Date() - countTimeByPage.current

    const timeByPageList = [...timeByPage, finishedTimeByPage]

    // const showSurveyModal =
    //   [!!test?.survey_id?.questions?.length, !answerSurveyQuestion?.length].every(Boolean) ||
    //   [!!position?.upload_test?.length, isShowModal].every(Boolean)

    if (JSON.stringify(position) !== '{}') {
      // if (showSurveyModal) {
      //   setShowSurvey(true)
      // } else {
      //   handleSurveySubmitWithPosition(currentListAnswerCorrectByUser, timeByPageList, finishedTime)
      // }

      setShowSurvey(true)
    } else {
      dispatch(
        submitCustomTest(
          () => setStep((prev) => prev + 1),
          currentListAnswerCorrectByUser,
          campaignId,
          positionId,
          test.test_id._id,
          timeByPageList,
          finishedTime,
          listCustomTestQuestion,
          currentListAnswerByUser,
        ),
      )
    }
  }, [
    handleCheckListGroupQuestionWasAnswered,
    timeByPage,
    position,
    dispatch,
    currentListAnswerCorrectByUser,
    campaignId,
    positionId,
    test,
    listCustomTestQuestion,
    currentListAnswerByUser,
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
      currentListAnswerCorrectByUser.forEach((answer) => {
        if (answer !== null) {
          answerCount++
        }
      })
      totalQuestion = currentListAnswerCorrectByUser.length

      let finishedTime = new Date() - startedTime.current

      dispatch(
        submitCustomTestWithPosition(
          () => setStep((prev) => prev + 1),
          currentListAnswerCorrectByUser,
          position,
          campaignId,
          test._id,
          answerSurveyQuestion,
          cvFile,
          coverLetterFile,
          timeByPage,
          finishedTime,
          listCustomTestQuestion,
          currentListAnswerByUser,
        ),
      )

      dispatch(
        handleOpenModalTimedOut(
          answerCount,
          totalQuestion,
          `custom-test-campaign-result/${campaignId}/${positionId}/${testId}`,
        ),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

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
      !steps?.length &&
      !listIndexError?.length &&
      dataPage.currentPage + 1 === Math.ceil(listCustomTestQuestion?.length / maxQuestionPerCustomTestPage)
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
  //   if (
  //     (answerSurveyQuestion?.length && !listIndexError.length) ||
  //     (position?.upload_test?.length && !listIndexError.length)
  //   ) {
  //     handleSurveySubmit()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [answerSurveyQuestion])

  const handleOpenLoginModal = () => {
    if (trigger) return
    setLoginModalVisible((prev) => !prev)
  }

  const handleAnswerSurveyQuestion = (values) => {
    setCvFile(values?.attach_cv?.file)
    setCoverLetterFile(values?.attach_cover_letter?.file)

    const surveyAnswer = test?.survey_id?.questions?.map((question) => ({
      ...question,
      answer: values[question?._id],
    }))

    setAnswerSurveyQuestion(surveyAnswer)

    let finishedTime = new Date() - startedTime.current
    let finishedTimeByPage = new Date() - countTimeByPage.current

    const timeByPageList = [...timeByPage, finishedTimeByPage]

    handleSurveySubmitWithPosition(currentListAnswerCorrectByUser, timeByPageList, finishedTime)
  }

  return (
    <TemplatePage namePage='survey-page' typeHeader='expand' reWork={false}>
      <Background />
      {step === 0 && (
        <CustomTestModalInstructor
          position={position}
          amountPageSurvey={handleCountTotalPage()}
          contentContainer={contentPage.instructor}
          onStartSurvey={handleStartCustomTest}
          loading={loading}
          test={test}
        />
      )}
      {step !== handleCountTotalPage() + 1 && step !== 0 && (
        <TemplateCustomTest
          position={position}
          contentCommon={contentCommon}
          isAuthenticated={isAuthenticated}
          requiredStep={requiredSteps?.[0]}
          listAnswer={currentListAnswerCorrectByUser}
          showSurvey={showSurvey}
          loginModalVisible={loginModalVisible}
          listCustomTestQuestion={currentListCustomTestQuestion}
          indexPageCustomTest={dataPage.currentPage}
          contentContainer={contentPage.template}
          amountPageCustomTest={handleCountTotalPage()}
          profileLoadingSubmit={profileLoadingSubmit}
          maxQuestionPerCustomTestPage={maxQuestionPerCustomTestPage}
          survey={test?.survey_id?.questions}
          test={test}
          onNext={handleNextCustomTestPage}
          onBack={handleBackCustomTestPage}
          onSubmit={handleSurveySubmit}
          onTimedOut={handleTimedOut}
          onOpenLoginModal={handleOpenLoginModal}
          onSubmitAnswerSurveyQuestion={handleAnswerSurveyQuestion}
        />
      )}
      {step === handleCountTotalPage() + 1 && (
        <CustomTestModalFinish
          contentCommon={contentCommon}
          contentContainer={contentPage.finish}
          campaignId={campaignId}
          positionId={positionId}
          testId={testId}
        />
      )}
      {step !== handleCountTotalPage() + 1 && <ProgressBar step={step} amountPageSurvey={handleCountTotalPage()} />}
    </TemplatePage>
  )
}

export default CustomTestCampaignPage
