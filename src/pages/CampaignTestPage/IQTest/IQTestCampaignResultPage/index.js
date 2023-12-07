import './style.scss'
import React, { useEffect } from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import i18nVN from 'i18n/locales/vn'
import ButtonArrow from 'components/Button/Arrow'
import TemplatePage from 'containers/TemplatePage'
import { fetchInfoResult } from 'redux/services/discTestCampaign'
import { redirectToWithReplace, convertTotalTestTimeToString } from 'utils'

const IQTestCampaignResultPage = () => {
  const { campaign_id: campaignId, position_id: positionId } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    pages: {
      iqTest: { iqResult: contentIQResult },
    },
  } = i18nVN.src

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
        () => redirectToWithReplace(history, `'/iq-test-campaign-result/${campaignId}/${positionId}`),
        location.pathname,
        campaignId,
        positionId,
      ),
    )
  }, [history, dispatch, location, campaignId, positionId])

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

  return (
    <TemplatePage namePage='iq-result-page' typeHeader='expand'>
      {Object.keys(iqResult).length ? (
        <div className='iq-result-modal'>
          <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
            <div className='iq-result-modal__header'>
              <div className='iq-result-modal__header__title'>{contentIQResult.title.yourResult}</div>
              <div className='iq-result-modal__header__subscription center'>
                {renderComment(correct, contentIQResult.title.comment)}
                <span className='iq-result-modal__header__subscription__bold'>{` ${correct}/25`}</span> <span>{convertTotalTestTimeToString(iqResult?.finished_time)}</span>
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
            </div>
          </ScrollAnimation>
        </div>
      ) : (
        <>
          <div className='iq-result-modal__header__empty-iq-result'>
            <div className='iq-result-modal__header__empty-iq-result__title'>{contentIQResult.title.yourResult}</div>
          </div>
          <div className='iq-result-page__content'>
            <div className='iq-result-page__content__empty-iq-result'><b>{contentIQResult.gettingData}</b></div>
            <div className='iq-result-page__content__testNow'>{contentIQResult.pleaseWait}</div>
          </div>
        </>
      )}
    </TemplatePage>
  )
}

export default IQTestCampaignResultPage
