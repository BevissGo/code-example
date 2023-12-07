import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import i18nVN from 'i18n/locales/vn'
import Button from 'components/Button/Default'
import TemplatePage from 'containers/TemplatePage'
import { fetchInfoResult } from 'redux/services/report'
import { redirectToWithPush, redirectToWithReplace, convertTotalTestTimeToString, formatSeconds } from 'utils'
import LoadingContainer from './components/LoadingContainer'
import Detail from './containers/Detail'
import SideOfBrain from './containers/SideOfBrain'
import BrainSharingResult from './containers/BrainSharingResult'

import './style.scss'

const LeftRightBrainTestResultPage = () => {
  const {
    pages: {
      leftRightBrainTest: { leftRightBrainResult: contentResult },
    },
    timeUnit
  } = i18nVN.src

  const {
    pages: { result: contentPage },
  } = i18nVN.src

  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

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
        () => redirectToWithReplace(history, '/brain-result'),
        location.pathname
      )
    )
  }, [history, dispatch, location])

  if (loadingGetReport) {
    return <LoadingContainer />
  } else if (!loadingGetReport && sideOfYourBrain === null) {
    return (
      <TemplatePage namePage='brain-result-page' typeHeader='expand'>
        <div className='brain-result-page__title'>
          {contentResult.common.yourResult}
        </div>
        <div className='brain-result-page__content'>
          <div className='brain-result-page__content__empty-iq-result'>
            {contentResult.emptyBrainTestResult}
          </div>
          <div className='brain-result-page__content__testNow'>
            {contentResult.testNowToGetResult}
          </div>
          <Button
            label={contentResult.testNow}
            onClick={() =>
              redirectToWithPush(history, '/left-right-brain-test')
            }
          />
        </div>
      </TemplatePage>
    )
  } else {
    return (
      <TemplatePage namePage='brain-result-page' typeHeader='expand'>
        <SideOfBrain
          side={sideOfYourBrain}
          sideOfBrain={contentResult[sideOfYourBrain].sideOfBrain}
          subscription={contentResult[sideOfYourBrain].subscription}
          contentCommon={contentResult.common}
          totalTime={convertTotalTestTimeToString(formatSeconds(reportBrainTestNewest.finished_time),timeUnit)}
          score={reportBrainTestNewest.score}
        />
        <Detail
          side={sideOfYourBrain}
          contentCommon={contentResult.common}
          contentDetail={contentResult[sideOfYourBrain].detail}
        />
        <BrainSharingResult
          infoUser={infoUser}
          contentContainer={contentPage.sharing}
        />
      </TemplatePage>
    )
  }
}

export default LeftRightBrainTestResultPage
