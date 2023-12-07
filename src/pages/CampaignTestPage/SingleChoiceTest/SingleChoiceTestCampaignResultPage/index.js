import './style.scss'
import React, { useEffect } from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import i18nVN from 'i18n/locales/vn'
import ButtonArrow from 'components/Button/Arrow'
import TemplatePage from 'containers/TemplatePage'
import { fetchInfoResult } from 'redux/services/discTestCampaign'
import { redirectToWithReplace } from 'utils'

const SingleChoiceTestCampaignResultPage = () => {
  const { campaign_id: campaignId, position_id: positionId } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    pages: {
      iqTest: { iqResult: contentIQResult },
    },
  } = i18nVN.src

  const reportSingleChoiceNewest = useSelector((state) => state.report.reportSingleChoiceNewest)

  const { correct, question_amount, fit_correct } = reportSingleChoiceNewest ?? {}

  useEffect(() => {
    dispatch(
      fetchInfoResult(
        () => redirectToWithReplace(history, `/single-choice-test-campaign-result/${campaignId}/${positionId}`),
        location.pathname,
        campaignId,
        positionId,
      ),
    )
  }, [history, dispatch, location, campaignId, positionId])

  return (
    <TemplatePage namePage='iq-result-page' typeHeader='expand'>
      {reportSingleChoiceNewest ? (
        <div className='iq-result-modal'>
          <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
            <div className='iq-result-modal__header'>
              <div className='iq-result-modal__header__title'>Kết quả bài thi trắc nghiệm của bạn</div>
              <div className='iq-result-modal__header__subscription center'>
                <span>Bạn đã làm đúng được </span>
                <span className='iq-result-modal__header__subscription__bold'>{`${correct ?? 0}/${
                  question_amount ?? 0
                }`}</span>
              </div>
              <div
                className={
                  correct >= fit_correct ? 'iq-result-modal__header__pass__point' : 'iq-result-modal__header__point'
                }
              >{`${correct ?? 0}/${question_amount ?? 0}`}</div>
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

export default SingleChoiceTestCampaignResultPage
