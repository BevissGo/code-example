import './style.scss'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { isEmpty } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPositionCampaign } from 'redux/services/positionCampaign'
import config from 'configs'
import i18nVN from 'i18n/locales/vn'
import { iqTestPage } from 'constants/images'
import useMergeState from 'hooks/useMergeState'
import TemplatePage from 'containers/TemplatePage'
import { checkForHexRegExp, redirectToWithReplace } from 'utils'
import { getCurrentListGroupQuestion, toastifyNotify } from 'helpers'
import businessManagement from 'assets/images/business-management.svg'
import { handleOpenModalFailure } from 'redux/services/modalError'
import { submitIQTest, submitIQTestWithPositionCampaign } from 'redux/services/IQTestCampaign'
import Background from 'components/Background'
import GoogleSignIn from 'components/Button/GoogleSignIn'
// import { updateCandidateInformation } from 'redux/services/profile'
// import AddInformationProfile from '../../components/AddInformationProfile'
import ProgressBar from './components/ProgressBar'
import IQModalFinish from './containers/IQModal/Finish'
import TemplateIQTest from './containers/TemplateIQTest'
import IQModalInstructor from './containers/IQModal/Instructor'

const IQTestCampaignPage = (props) => {
  const { campaign_id: campaignId, position_id: positionId } = props.match.params
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

  // const {
  //   pages: {
  //     signup: { updateProfileModal: updateProfileContent },
  //   },
  // } = i18nVN.src

  // Get amount group question per page
  const { maxGroupQuestionPerSurveyPage } = config

  const dispatch = useDispatch()
  const history = useHistory()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  // const profileData = useSelector((state) => state.profile.profile)

  // const { name, sex, phone, facebook_profile_url } = profileData
  // const enoughInformation = [!!name, !!sex, !!phone, !!facebook_profile_url].every(Boolean)

  // Get list answer IQ choose by user
  const listAnswerByUser = useSelector((state) => state.IQTest.listAnswer)

  // Get facebook profile url

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
      redirectToWithReplace(history, `/${campaignId}/${positionId}`)
      return
    }

    await fetchPositionCampaign(dispatch, campaignId, positionId, 'iq_score', setPosition, setLoading, history)
  }, [positionId, dispatch, campaignId, history])

  // Check current list group question have element which was not answered
  const handleCheckListGroupQuestionWasAnswered = useCallback(
    (listIndexError) => {
      // convert { 1:'a', 2:'b', ..., 25: 'c'} into [ [1,'a'], [2,'b'], ...]
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
    },
    [dataPage.currentPage, currentListAnswerByUser, maxGroupQuestionPerSurveyPage],
  )

  const handleIqSubmitWithPosition = useCallback(
    async (listAnswer, timeByPage, finishedTime) => {
      dispatch(
        submitIQTestWithPositionCampaign(
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
    [dispatch, position, campaignId, answerSurvey, cvFile, coverLetterFile],
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

    // const showSurveyModal =
    // [!!position?.survey_iq_score?.questions?.length, !answerSurvey?.length].every(Boolean) ||
    // [!!position?.upload_test?.length, isShowModal].every(Boolean)

    if (JSON.stringify(position) !== '{}') {
      // if (showSurveyModal) {
      //   setShowSurvey(true)
      // } else {
      //   handleIqSubmitWithPosition(currentListAnswerByUser, timeByPageList, finishedTime)
      // }
      setShowSurvey(true)
    } else {
      dispatch(
        submitIQTest(
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

  // Fetch position if position
  useEffect(() => {
    if (positionId) {
      getPosition()
    }
  }, [positionId, getPosition])

  useEffect(() => {
    if (!isEmpty(position) && !position?.category_test?.includes('iq_score')) {
      redirectToWithReplace(history, '/')
      toastifyNotify('error', "There is no IQ Test for this campaign's position!")
      return
    }
  }, [position, history])

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
      dataPage.currentPage + 1 === listGroupQuestion.length / maxGroupQuestionPerSurveyPage
    ) {
      handleSurveySubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAuthenticated,
    // enoughInformation,
    dataPage.currentPage,
    profileLoadingSubmit,
  ])

  // useEffect(() => {
  //   let listIndexError = []
  //   handleCheckListGroupQuestionWasAnswered(listIndexError)
  //   if (position?.upload_test?.length && !listIndexError.length) {
  //     handleSurveySubmit()
  //   }
  // }, [handleCheckListGroupQuestionWasAnswered, handleSurveySubmit, position?.upload_test?.length])

  const handleStartSurvey = () => {
    setStep(1)
    window.scroll(0, 0)
    startedTime.current = new Date()
    countTimeByPage.current = new Date()
  }

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

  const handleAnswerSurvey = async (values) => {
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

    handleIqSubmitWithPosition(currentListAnswerByUser, timeByPageList, finishedTime)
  }

  const handleOpenLoginModal = () => {
    setLoginModalVisible((prev) => !prev)
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
            loading={loading}
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
            showSurvey={showSurvey}
            indexPageSurvey={dataPage.currentPage}
            contentContainer={contentPage.template}
            listGroupAnswer={currentListGroupAnswer}
            amountPageSurvey={handleCountTotalPage()}
            profileLoadingSubmit={profileLoadingSubmit}
            listGroupQuestion={currentListGroupQuestion}
            maxGroupQuestionPerSurveyPage={maxGroupQuestionPerSurveyPage}
            survey={position?.survey_iq_score?.questions}
            onNext={handleNextSurveyPage}
            onBack={handleBackSurveyPage}
            onSubmit={handleSurveySubmit}
            onOpenLoginModal={handleOpenLoginModal}
            onSubmitAnswerSurvey={handleAnswerSurvey}
          />
        )}
        {step === handleCountTotalPage() + 1 && (
          <IQModalFinish
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

export default IQTestCampaignPage
