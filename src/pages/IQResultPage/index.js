import React, { useEffect } from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { FacebookShareButton } from 'react-share'
import { updateSharedFacebook } from 'redux/services/profile'

import config from 'configs'
import i18nVN from 'i18n/locales/vn'
import Button from 'components/Button/Default'
import ButtonArrow from 'components/Button/Arrow'
import TemplatePage from 'containers/TemplatePage'
import { fetchInfoResult } from 'redux/services/report'
import { redirectToWithReplace, redirectToWithPush, convertTotalTestTimeToString, formatSeconds } from 'utils'

import LoadingContainer from './components/LoadingContainer'
import './style.scss'

const IQResultPage = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    pages: {
      iqTest: { iqResult: contentIQResult },
      result: contentResult,
    },
    timeUnit,
  } = i18nVN.src

  const infoUser = useSelector((state) => state.profile.profile)
  const reportIqNewest = useSelector((state) => state.report.reportIqNewest)
  const loadingReport = useSelector((state) => state.report.loadingGet)
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
    dispatch(fetchInfoResult(() => redirectToWithReplace(history, '/iq-result'), location.pathname))
  }, [history, dispatch, location])

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
    if (correct <= 5) {
      return (
        <div>
          <div className='iq-result-modal__header__subscription left'>{subscription.low.firstSubscription}</div>
          <div className='iq-result-modal__header__subscription left'>{subscription.low.secondSubscription}</div>
        </div>
      )
    } else if (correct > 5 && correct <= 10) {
      return (
        <div>
          <div className='iq-result-modal__header__subscription left'>{subscription.low.firstSubscription}</div>
          <div className='iq-result-modal__header__subscription left'>{subscription.low.secondSubscription}</div>
        </div>
      )
    } else if (correct > 10 && correct <= 12) {
      return (
        <div>
          <div className='iq-result-modal__header__subscription left'>{subscription.middle.firstSubscription}</div>
          <div className='iq-result-modal__header__subscription left'>{subscription.middle.secondSubscription}</div>
        </div>
      )
    } else if (correct > 12 && correct <= 16) {
      return (
        <div>
          <div className='iq-result-modal__header__subscription left'>{subscription.high.firstSubscription}</div>
        </div>
      )
    } else {
      return (
        <div>
          <div className='iq-result-modal__header__subscription left'>{subscription.great.firstSubscription}</div>
        </div>
      )
    }
  }

  if (loadingReport) {
    return <LoadingContainer />
  } else {
    return (
      <TemplatePage namePage='iq-result-page' typeHeader='expand'>
        {Object.keys(iqResult).length ? (
          <div className='iq-result-modal'>
            <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
              <div className='iq-result-modal__header'>
                <div className='iq-result-modal__header__title'>{contentIQResult.title.yourResult}</div>
                <div className='iq-result-modal__header__subscription center'>
                  {renderComment(correct, contentIQResult.title.comment)}
                  <span className='iq-result-modal__header__subscription__bold'>
                    {correct < 5 ? contentIQResult.correctVeryLow : ` ${correct}/25 `}
                  </span>
                  {convertTotalTestTimeToString(formatSeconds(reportIqNewest.finished_time), timeUnit)}
                  {renderCorrectAnswers(correct, contentIQResult.title.correctAnswers)}
                  &nbsp;{contentIQResult.title.totalScore}&nbsp;
                </div>
                <div className='iq-result-modal__header__point'>{score}</div>
                <div className='iq-result-modal__header__subscription left'>
                  {contentIQResult.content.opening}&nbsp;
                  <span className='iq-result-modal__header__subscription__bold'>{rank}.</span>
                </div>
                {renderSubscription(correct, contentIQResult.content.subscription)}
              </div>
              <div className='iq-result-modal__footer flex justify-between'>
                <ButtonArrow
                  survey
                  label={contentIQResult.backHome}
                  transparent
                  onClick={() => redirectToWithReplace(history, '/')}
                />
                <FacebookShareButton
                  onShareWindowClose={() => dispatch(updateSharedFacebook())}
                  url={`${config.URIClient}/result/${infoUser._id}#iq-result`}
                >
                  <Button label={contentResult.sharing.title} />
                </FacebookShareButton>
              </div>
            </ScrollAnimation>
          </div>
        ) : (
          <>
            <div className='iq-result-modal__header__empty-iq-result'>
              <div className='iq-result-modal__header__empty-iq-result__title'>{contentIQResult.title.yourResult}</div>
            </div>
            <div className='iq-result-page__content'>
              <div className='iq-result-page__content__empty-iq-result'>{contentIQResult.emptyIQResult}</div>
              <div className='iq-result-page__content__testNow'>{contentIQResult.testNowToGetResult}</div>
              <Button label={contentIQResult.testNow} onClick={() => redirectToWithPush(history, '/iq-test')} />
            </div>
          </>
        )}
      </TemplatePage>
    )
  }
}

export default IQResultPage
