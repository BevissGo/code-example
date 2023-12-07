import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import i18nVN from 'i18n/locales/vn'
import { USER_TYPE } from 'constants/userType'
import TemplatePage from 'containers/TemplatePage'
import Button from 'components/Button/Default'
import FooterPage from 'components/FooterPageV2'
import { AdsenseFullWidth } from 'components/Adsense'
import DropdownResult from 'components/Dropdown/DropdownResult'
import { fetchInfoResult } from 'redux/services/report'
import arrowDown from 'assets/images/icons/angle-arrow-down.svg'
import { redirectToWithPush, redirectToWithReplace } from 'utils'
import ModalShare from './components/ModalShare'
import LoadingContainer from './components/LoadingContainer'
import Influencer from './containers/Influencer'
import JobSpecific from './containers/JobSpecific'
import MeaningResult from './containers/MeaningResult'
import MyDISCResultBasic from './containers/MyDISCResultBasic'
import ResultOnlineExpand from './containers/ResultOnlineExpand'
import AnalyzingCharacter from './containers/AnalyzingCharacter'
import MyDISCSharingResult from './containers/MyDISCSharingResult'
import MyDISCIntroResultPage from './containers/MyDISCIntroResultPage'
import MyDISCResultOnlineBasic from './containers/MyDISCResultOnlineBasic'

import './style.scss'

const MyDISCResultPage = () => {
  const location = useLocation()
  const {
    pages: { result: contentPage },
  } = i18nVN.src

  const dispatch = useDispatch()
  const history = useHistory()

  const [isShowShareModal, setShowShareModal] = useState(false)
  const [openDropdownResult, setOpenDropdownResult] = useState(false)

  const typeUser = useSelector((state) => state.profile.profile.type_user)
  const infoUser = useSelector((state) => state.profile.profile)
  const loadingGetProfile = useSelector((state) => state.profile.loadingGet)
  const listChart = useSelector((state) => state.report.listChart)
  const listPersonality = useSelector((state) => state.report.listPersonality)
  const profilePattern = useSelector((state) => state.report.profilePattern)
  const loadingGetReport = useSelector((state) => state.report.loadingGet)

  const handleShowShareModal = () => {
    setShowShareModal(!isShowShareModal)
  }

  const handleCloseDropdownResult = () => {
    setOpenDropdownResult(false)
  }

  const handleOpenDropdownResult = () => {
    setOpenDropdownResult(true)
  }

  useEffect(() => {
    dispatch(
      fetchInfoResult(
        () => redirectToWithReplace(history, '/survey'),
        location.pathname
      )
    )
  }, [history, dispatch, location])

  const renderResult = (loadingGetProfile, loadingGetReport, profilePattern) => {
    if (loadingGetProfile || loadingGetReport) {
      return (<LoadingContainer />)
    } else if (!loadingGetProfile && !loadingGetReport && Object.keys(profilePattern).length === 0) {
      return (
        <>
          {openDropdownResult && (
            <DropdownResult
              onClose={handleCloseDropdownResult}
              contentCommon={contentPage}
              activeResult='discResult'
            />
          )}
          <div className='my-disc-result-page__content'>
            <div className='my-disc-result-page__content__empty-disc-result'>{contentPage.emptyDISCResult}</div>
            <div className='my-disc-result-page__content__testNow'>{contentPage.testNowToGetResult}</div>
            <Button
              label={contentPage.testNow}
              onClick={() => redirectToWithPush(history, '/survey')}
            />
          </div>
        </>
      )
    } else {
      return (
        <>
          {openDropdownResult && (
            <DropdownResult
              onClose={handleCloseDropdownResult}
              contentCommon={contentPage}
              activeResult='discResult'
            />
          )}
          <MyDISCIntroResultPage
            contentContainer={contentPage.intro}
            profilePattern={profilePattern}
            infoUser={infoUser}
            listChart={listChart}
            // finishedTime={finishedTime}
            listPersonality={listPersonality}
            loadingProfile={loadingGetProfile}
            loadingReport={loadingGetReport}
          />
          <div className='adsense'>
            <AdsenseFullWidth />
          </div>
          <MyDISCResultOnlineBasic
            listChart={listChart}
            contentContainer={contentPage.resultOnline}
            isGuess={
              !loadingGetProfile &&
              !loadingGetReport &&
              typeUser === USER_TYPE.GUESS
            }
          />
          <div className='adsense'>
            <AdsenseFullWidth />
          </div>
          {(!loadingGetProfile && !loadingGetReport && typeUser === USER_TYPE.GUESS) && (
            <MyDISCResultBasic handleShowShareModal={handleShowShareModal} />
          )}
          <div className='adsense'>
            <AdsenseFullWidth />
          </div>
          {(loadingGetProfile || loadingGetReport) && <LoadingContainer />}
          {!loadingGetProfile &&
            !loadingGetReport &&
            typeUser === USER_TYPE.GUESS &&
            RenderContentFree()}
          {!loadingGetProfile &&
            !loadingGetReport &&
            typeUser === USER_TYPE.PREMIUM &&
            RenderContentPremium()}
          <MyDISCSharingResult
            infoUser={infoUser}
            contentContainer={contentPage.sharing}
          />
        </>
      )
    }
  }

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
      <TemplatePage namePage='my-disc-result-page' typeHeader='expand'>
        <div className='my-disc-result-page__title'>{contentPage.title}</div>
        <div className='my-disc-result-page__tab'>
          <div className='my-disc-result-page__tab__active'
            onClick={handleOpenDropdownResult}
          >
            {contentPage.discResult}
            <img src={arrowDown} alt='' />
          </div>
        </div>
        {renderResult(loadingGetProfile, loadingGetReport, profilePattern)}
        <FooterPage />
      </TemplatePage>
      {isShowShareModal && (
        <ModalShare
          handleShowShareModal={handleShowShareModal}
          infoUser={infoUser}
        />
      )}
    </>
  )
}

export default MyDISCResultPage
