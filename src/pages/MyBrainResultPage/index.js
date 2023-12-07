import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import i18nVN from 'i18n/locales/vn'
import TemplatePage from 'containers/TemplatePage'
import { fetchInfoResult } from 'redux/services/report'
import Button from 'components/Button/Default'
import FooterPage from 'components/FooterPageV2'
import DropdownResult from 'components/Dropdown/DropdownResult'
import arrowDown from 'assets/images/icons/angle-arrow-down.svg'
import { redirectToWithPush, redirectToWithReplace, convertTotalTestTimeToString, formatSeconds } from 'utils'
import LoadingContainer from './components/LoadingContainer'
import Detail from './containers/Detail'
import SideOfBrain from './containers/SideOfBrain'
import MyBrainSharingResult from './containers/MyBrainSharingResult'

import './style.scss'

const MyBrainResultPage = () => {
  const {
    pages: { result: contentPage },
  } = i18nVN.src

  const {
    pages: {
      leftRightBrainTest: { leftRightBrainResult: contentResult },
    },
    timeUnit
  } = i18nVN.src

  const location = useLocation()
  const dispatch = useDispatch()
  const history = useHistory()

  const [openDropdownResult, setOpenDropdownResult] = useState(false)

  const infoUser = useSelector((state) => state.profile.profile)
  const loadingGetReport = useSelector((state) => state.report.loadingGet)
  const reportBrainTestNewest = useSelector(
    (state) => state.report.reportBrainTestNewest
  )
  const sideOfYourBrain = reportBrainTestNewest
    ? reportBrainTestNewest.sideOfBrain
    : null

  useEffect(() => {
    dispatch(
      fetchInfoResult(
        () => redirectToWithReplace(history, '/my-brain-result'),
        location.pathname
      )
    )
  }, [history, dispatch, location])

  const handleCloseDropdownResult = () => {
    setOpenDropdownResult(false)
  }

  const handleOpenDropdownResult = () => {
    setOpenDropdownResult(true)
  }

  const renderResult = (loadingGetReport) => {
    if (loadingGetReport) {
      return <LoadingContainer />
    } else if (!loadingGetReport && sideOfYourBrain === null) {
      return (
        <>
          {openDropdownResult && (
            <DropdownResult
              onClose={handleCloseDropdownResult}
              contentCommon={contentPage}
              activeResult='brainResult'
            />
          )}
          <div className='my-brain-result-page__content'>
            <div className='my-brain-result-page__content__empty-brain-result'>
              {contentPage.emptyBrainResult}
            </div>
            <div className='my-brain-result-page__content__testNow'>
              {contentPage.testNowToGetResult}
            </div>
            <Button
              label={contentPage.testNow}
              onClick={() =>
                redirectToWithPush(history, '/left-right-brain-test')
              }
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
              activeResult='brainResult'
            />
          )}
          <div className='my-brain-result-page__content'>
            <SideOfBrain
              side={sideOfYourBrain}
              sideOfBrain={contentResult[sideOfYourBrain]?.sideOfBrain}
              subscription={contentResult[sideOfYourBrain]?.subscription}
              contentCommon={contentResult.common}
              totalTime={convertTotalTestTimeToString(formatSeconds(reportBrainTestNewest.finished_time),timeUnit)}
              score={reportBrainTestNewest.score}
            />
            <Detail
              side={sideOfYourBrain}
              contentCommon={contentResult.common}
              contentDetail={contentResult[sideOfYourBrain]?.detail}
            />
          </div>
          <MyBrainSharingResult
            infoUser={infoUser}
            contentContainer={contentPage.sharing}
          />
        </>
      )
    }
  }

  return (
    <TemplatePage namePage='my-brain-result-page' typeHeader='expand'>
      <div className='my-brain-result-page__title'>{contentPage.title}</div>
      <div className='my-brain-result-page__tab'>
        <div className='my-brain-result-page__tab__active' 
          onClick={handleOpenDropdownResult}
        >
          {contentPage.brainResult}
          <img src={arrowDown} alt='' />
        </div>
      </div>
      {renderResult(loadingGetReport)}
      <FooterPage />
    </TemplatePage>
  )
}

export default MyBrainResultPage
