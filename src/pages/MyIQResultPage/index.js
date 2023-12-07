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
import MyIQSharingResult from './containers/MyIQSharingResult'

import './style.scss'

const MyIQResultPage = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const history = useHistory()
  
  const [openDropdownResult, setOpenDropdownResult] = useState(false)

  const {
    pages: {
      iqTest: {
        iqResult: contentIQResult,
      },
      result: contentPage,
    },
    timeUnit
  } = i18nVN.src

  const infoUser = useSelector((state) => state.profile.profile)
  const loadingGetReport = useSelector((state) => state.report.loadingGet)
  const reportIqNewest = useSelector((state) => state.report.reportIqNewest)
  const iqResult = reportIqNewest ? reportIqNewest : {}
  let score = 0
  let correct = 0
  let rank = ''

  if (Object.keys(iqResult).length > 0) {
    score = iqResult.score
    correct = iqResult.correct
    rank = iqResult.rank
  }

  useEffect(() => {
    dispatch(
      fetchInfoResult(
        () => redirectToWithReplace(history, '/my-iq-result'),
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

  const renderResult = (iqResult) => {
    if (loadingGetReport) {
      return (<LoadingContainer />)
    } else if (!loadingGetReport && Object.keys(iqResult).length === 0) {
      return (
        <>
          {openDropdownResult && (
            <DropdownResult
              onClose={handleCloseDropdownResult}
              contentCommon={contentPage}
              activeResult='iqResult'
            />
          )}
          <div className='my-iq-result-page__content'>
            <div className='my-iq-result-page__content__empty-iq-result'>{contentIQResult.emptyIQResult}</div>
            <div className='my-iq-result-page__content__testNow'>{contentIQResult.testNowToGetResult}</div>
              <Button
                label={contentIQResult.testNow}
                onClick={() => redirectToWithPush(history, '/iq-test')}
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
              activeResult='iqResult'
            />
          )}
          <div className='my-iq-result-page__content'>
            <div className='my-iq-result-page__content__subscription__center'>
              {renderComment(correct, contentIQResult.title.comment)}
              <span className='my-iq-result-page__content__subscription__bold'>
                {correct < 5 ? contentIQResult.correctVeryLow : ` ${correct}/25 `}
              </span>
              {convertTotalTestTimeToString(formatSeconds(reportIqNewest.finished_time), timeUnit)}
              {renderCorrectAnswers(correct, contentIQResult.title.correctAnswers)}
              &nbsp;{contentIQResult.title.totalScore}&nbsp;
            </div>
            <div className='my-iq-result-page__content__point'>
              {score}
            </div>
            <div className='my-iq-result-page__content__subscription'>
              {contentIQResult.content.opening}&nbsp;
              <span className='my-iq-result-page__content__subscription__bold'>
                {rank}.
              </span>
            </div>
            {renderSubscription(correct, contentIQResult.content.subscription)}
          </div>
          <MyIQSharingResult
            infoUser={infoUser}
            contentContainer={contentPage.sharing}
          />
        </>
      )
    }
  }

  const renderComment = (correct, comment) => {
    if (correct <= 10) {
      return comment.low
    } else if (correct > 10 && correct <= 12) {
      return comment.average
    } else {
      return comment.high
    }
  }

  const renderCorrectAnswers = (correct, correctAnswers) => {
    if (correct < 11) {
      return correctAnswers.few
    } else {
      return correctAnswers.many
    }
  }

  const renderSubscription = (correct, subscription) => {
    if (correct <= 10) {
      return (
        <div>
          <div className='my-iq-result-page__content__subscription'>
            {subscription.low.firstSubscription}
          </div>
          <div className='my-iq-result-page__content__subscription'>
            {subscription.low.secondSubscription}
          </div>
        </div>
      )
    } else if (correct > 10 && correct <= 12) {
      return (
        <div>
          <div className='my-iq-result-page__content__subscription'>
            {subscription.middle.firstSubscription}
          </div>
          <div className='my-iq-result-page__content__subscription'>
            {subscription.middle.secondSubscription}
          </div>
        </div>
      )
    } else if (correct > 12 && correct <= 16) {
      return (
        <div>
          <div className='my-iq-result-page__content__subscription'>
            {subscription.high.firstSubscription}
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div className='my-iq-result-page__content__subscription'>
            {subscription.great.firstSubscription}
          </div>
        </div>
      )
    }
  }

  return (
    <TemplatePage namePage='my-iq-result-page' typeHeader='expand'>
      <div className='my-iq-result-page__title'>{contentPage.title}</div>
      <div className='my-iq-result-page__tab'>
        <div className='my-iq-result-page__tab__active'
          onClick={handleOpenDropdownResult}
        >
          {contentPage.iqResult}
          <img src={arrowDown} alt='' />
        </div>
      </div>
      {renderResult(iqResult)}
      <FooterPage />
    </TemplatePage>
  )
}

export default MyIQResultPage
