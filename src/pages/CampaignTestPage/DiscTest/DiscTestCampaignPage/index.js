import './style.scss'
import React, { useRef, useState, useEffect, useCallback } from 'react'
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
import { fetchPositionCampaign } from 'redux/services/positionCampaign'
import { handleOpenModalFailure } from 'redux/services/modalError'
import { submitSurvey, submitSurveyWithPosition } from 'redux/services/discTestCampaign'
import Background from 'components/Background'
import GoogleSignIn from 'components/Button/GoogleSignIn'
import TemplatePage from 'containers/TemplatePage'
import { handleOpenModalTimedOut } from 'redux/services/modalTimedOut'
// import { updateCandidateInformation } from 'redux/services/profile'
// import AddInformationProfile from '../../components/AddInformationProfile'
import ProgressBar from './components/ProgressBar'
import ModalFinish from './containers/Modal/Finish'
import TemplateSurvey from './containers/TemplateSurvey'
import ModalInstructor from './containers/Modal/Instructor'

const DiscTestCampaignPage = (props) => {
  const { campaign_id: campaignId, position_id: positionId } = props.match.params

  const dispatch = useDispatch()
  const history = useHistory()

  const [loginModalVisible, setLoginModalVisible] = useState(false)
  const [position, setPosition] = useState({})
  const [showSurvey, setShowSurvey] = useState(false)
  const [answerSurvey, setAnswerSurvey] = useState([])
  const [requiredSteps, setRequiredSteps] = useState([])
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

  // const {
  //   pages: {
  //     signup: { updateProfileModal: updateProfileContent },
  //   },
  // } = i18nVN.src

  // Get amount group question per page
  const { maxGroupQuestionPerSurveyPage } = config

  const getPosition = async () => {
    if (!checkForHexRegExp.test(`${positionId}`)) {
      redirectToWithReplace(history, `/${campaignId}/${positionId}`)
      return
    }

    await fetchPositionCampaign(dispatch, campaignId, positionId, 'disc_score', setPosition, setLoading, history)
  }

  // Fetch position if position
  useEffect(() => {
    if (positionId) {
      getPosition()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isEmpty(position) && !position?.category_test?.includes('disc_score')) {
      redirectToWithReplace(history, '/')
      toastifyNotify('error', "There is no IQ Test for this campaign's position!")
      return
    }
  }, [position, history])

  // const profileData = useSelector((state) => state.profile.profile)

  // const { name, sex, phone, facebook_profile_url } = profileData
  // const enoughInformation = [!!name, !!sex, !!phone, !!facebook_profile_url].every(Boolean)
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

  const handleStartSurvey = () => {
    setStep(1)
    window.scroll(0, 0)
    startedTime.current = new Date()
    countTimeByPage.current = new Date()
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
    [dataPage.currentPage, listGroupQuestion, maxGroupQuestionPerSurveyPage],
  )

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

    const surveyAnswer = position?.survey_disc_score?.questions?.map((question) => ({
      ...question,
      answer: values[question?._id],
    }))

    setAnswerSurvey(surveyAnswer)

    const listAnswer = listGroupQuestion.map((groupQuestion) => groupQuestion.answer)

    let finishedTime = new Date() - startedTime.current
    let finishedTimeByPage = new Date() - countTimeByPage.current

    const timeByPageList = [...timeByPage, finishedTimeByPage]

    handleSurveySubmitWithPosition(listAnswer, timeByPageList, finishedTime)
  }

  const handleSurveySubmitWithPosition = useCallback(
    async (listAnswer, timeByPage, finishedTime) => {
      dispatch(
        submitSurveyWithPosition(
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

    if (listIndexError?.length) {
      dispatch(handleOpenModalFailure(null, listIndexError))
      return
    }
    // if (!listIndexError?.length && !enoughInformation) {
    //   setLoginModalVisible(true)
    //   return
    // }

    const listAnswer = listGroupQuestion.map((groupQuestion) => groupQuestion.answer)

    let finishedTime = new Date() - startedTime.current
    let finishedTimeByPage = new Date() - countTimeByPage.current

    const timeByPageList = [...timeByPage, finishedTimeByPage]

    // const showSurveyModal =
    //   [!!position?.survey_disc_score?.questions?.length, !answerSurvey?.length].every(Boolean) ||
    //   [!!position?.upload_test?.length, isShowModal].every(Boolean)

    if (JSON.stringify(position) !== '{}') {
      // if (showSurveyModal) {
      //   setShowSurvey(true)
      // } else {
      //   handleSurveySubmitWithPosition(listAnswer, timeByPageList, finishedTime)
      // }

      setShowSurvey(true)
    } else {
      dispatch(
        submitSurvey(
          () => setStep((prev) => prev + 1),
          listAnswer,
          campaignId,
          positionId,
          timeByPageList,
          finishedTime,
        ),
      )
    }
  }, [
    handleCheckListGroupQuestionWasAnswered,
    listGroupQuestion,
    timeByPage,
    position,
    dispatch,
    campaignId,
    positionId,
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

  const [trigger, setTrigger] = useState(false)
  useEffect(() => {
    if (trigger) {
      // if (!enoughInformation) {
      //   setLoginModalVisible(true)
      //   return
      // }
      let answerCount = 0,
        totalQuestion = 0
      answerSurvey.forEach((answer) => {
        if (answer !== null) {
          answerCount++
        }
      })
      totalQuestion = answerSurvey.length

      dispatch(submitSurvey(() => {}, answerSurvey, 0, campaignId, positionId))
      dispatch(
        handleOpenModalTimedOut(answerCount, totalQuestion, `disc-test-campaign-result/${campaignId}/${positionId}`),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    trigger,
    //  enoughInformation
  ])

  const handleTimedOut = () => {
    setTrigger(true)
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
    //     description: updateProfileContent.descriptionCampaign,
    //     action: <AddInformationProfile loading={profileLoadingSubmit} onClick={handleUpdateCandidateInformation} />,
    //   })
    // }

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

  return (
    <>
      <Helmet>
        <title>{contentPage.titleTag}</title>
      </Helmet>
      <TemplatePage namePage='survey-page' typeHeader='expand'>
        <Background />
        {step === 0 && (
          <ModalInstructor
            loading={loading || loadingGetListGroupQuestion}
            contentCommon={contentCommon}
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
            showSurvey={showSurvey}
            indexPageSurvey={dataPage.currentPage}
            contentContainer={contentPage.template}
            amountPageSurvey={handleCountTotalPage()}
            profileLoadingSubmit={profileLoadingSubmit}
            listGroupQuestion={currentListGroupQuestion}
            maxGroupQuestionPerSurveyPage={maxGroupQuestionPerSurveyPage}
            survey={position?.survey_disc_score?.questions}
            onNext={handleNextSurveyPage}
            onBack={handleBackSurveyPage}
            onSubmit={handleSurveySubmit}
            onChangeRadio={handleChangeRadio}
            onOpenLoginModal={handleOpenLoginModal}
            onSubmitAnswerSurvey={handleAnswerSurvey}
            onTimedOut={handleTimedOut}
          />
        )}
        {!loadingGetListGroupQuestion && (
          <>
            {step === handleCountTotalPage() + 1 && (
              <ModalFinish
                contentCommon={contentCommon}
                contentContainer={contentPage.finish}
                campaignId={campaignId}
                positionId={positionId}
              />
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

export default DiscTestCampaignPage
