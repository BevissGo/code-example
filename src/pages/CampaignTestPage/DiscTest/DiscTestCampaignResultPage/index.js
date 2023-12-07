import './style.scss'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import i18nVN from 'i18n/locales/vn'
import { redirectToWithReplace } from 'utils'
import TemplatePage from 'containers/TemplatePage'
import { fetchInfoResult } from 'redux/services/discTestCampaign'
import { USER_TYPE } from 'constants/userType'
import Influencer from './containers/Influencer'
import JobSpecific from './containers/JobSpecific'
import MeaningResult from './containers/MeaningResult'
import SharingResult from './containers/SharingResult'
import IntroResultPage from './containers/IntroResultPage'
import LoadingContainer from './components/LoadingContainer'
import ResultOnlineBasic from './containers/ResultOnlineBasic'
import AnalyzingCharacter from './containers/AnalyzingCharacter'
import ResultOnlineExpand from './containers/ResultOnlineExpand'
import ResultBasic from './containers/ResultBasic'
import ModalShare from './components/ModalShare'

const DiscTestCampaignResultPage = () => {
  const { campaign_id: campaignId, position_id: positionId } = useParams()

  const location = useLocation()
  const {
    pages: { result: contentPage },
  } = i18nVN.src

  const dispatch = useDispatch()
  const history = useHistory()

  const [isShowShareModal, setShowShareModal] = useState(false)

  const typeUser = useSelector((state) => state.profile.profile.type_user)
  const infoUser = useSelector((state) => state.profile.profile)
  const loadingGetProfile = useSelector((state) => state.profile.loadingGet)
  const listChart = useSelector((state) => state.report.listChart)
  const reportDiscNewest = useSelector((state) => state.report.reportDiscNewest)
  const listPersonality = useSelector((state) => state.report.listPersonality)
  const profilePattern = useSelector((state) => state.report.profilePattern)
  const loadingGetReport = useSelector((state) => state.report.loadingGet)

  const handleShowShareModal = () => {
    setShowShareModal(!isShowShareModal)
  }

  useEffect(() => {
    dispatch(
      fetchInfoResult(
        () => redirectToWithReplace(history, `/disc-test-campaign-result/${campaignId}/${positionId}`),
        location.pathname,
        campaignId,
        positionId,
      ),
    )
  }, [history, dispatch, location, campaignId, positionId])

  const RenderContentFree = () => {
    return (
      <>
        <MeaningResult />
      </>
    )
  }

  const RenderContentPremium = () => {
    return (
      <>
        <ResultOnlineExpand listChart={listChart} />
        <AnalyzingCharacter />
        <JobSpecific />
        <Influencer />
        <MeaningResult typeUser={typeUser} />
      </>
    )
  }

  return (
    <>
      <TemplatePage namePage='result-page' typeHeader='expand'>
        <IntroResultPage
          reportDiscNewest={reportDiscNewest}
          contentContainer={contentPage.intro}
          profilePattern={profilePattern}
          infoUser={infoUser}
          listChart={listChart}
          listPersonality={listPersonality}
          loadingProfile={loadingGetProfile}
          loadingReport={loadingGetReport}
        />
        <ResultOnlineBasic
          listChart={listChart}
          contentContainer={contentPage.resultOnline}
          freeMeaningContainer={contentPage.meaning.free}
          isGuess={!loadingGetProfile && !loadingGetReport && typeUser === USER_TYPE.GUESS}
        />
        {!loadingGetProfile && !loadingGetReport && typeUser === USER_TYPE.GUESS && (
          <ResultBasic handleShowShareModal={handleShowShareModal} />
        )}
        {(loadingGetProfile || loadingGetReport) && <LoadingContainer />}
        {!loadingGetProfile && !loadingGetReport && typeUser === USER_TYPE.GUESS && RenderContentFree()}
        {!loadingGetProfile && !loadingGetReport && typeUser === USER_TYPE.PREMIUM && RenderContentPremium()}
        <SharingResult infoUser={infoUser} contentContainer={contentPage.sharing} />
      </TemplatePage>
      {isShowShareModal && <ModalShare handleShowShareModal={handleShowShareModal} infoUser={infoUser} />}
    </>
  )
}

export default DiscTestCampaignResultPage
