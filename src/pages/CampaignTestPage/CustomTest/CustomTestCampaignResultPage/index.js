import React, { useEffect } from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'

import i18nVN from 'i18n/locales/vn'
import ButtonArrow from 'components/Button/Arrow'
import TemplatePage from 'containers/TemplatePage'
import { fetchInfoResult } from 'redux/services/customTestCampaign'
import { redirectToWithReplace } from 'utils'
import './style.scss'

const CustomTestCampaignResultPage = () => {
  const { campaign_id: campaignId, position_id: positionId, test_id: testId } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    pages: {
      iqTest: { iqResult: contentIQResult },
    },
  } = i18nVN.src

  const reportCustomTestNewest = useSelector((state) => state.report.reportCustomTestNewest)

  const { correct, question_amount, fit_correct } = reportCustomTestNewest ?? {}

  useEffect(() => {
    dispatch(
      fetchInfoResult(
        () => redirectToWithReplace(history, `/custom-test-campaign-result/${campaignId}/${positionId}/${testId}`),
        location.pathname,
        campaignId,
        positionId,
        testId,
      ),
    )
  }, [history, dispatch, location, campaignId, positionId, testId])

  return (
    <TemplatePage namePage='custom-test-result-page' typeHeader='expand'>
      {reportCustomTestNewest ? (
        <div className='custom-test-result-modal'>
          <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
            <div className='custom-test-result-modal__header'>
              <div className='custom-test-result-modal__header__title'>Kết quả bài thi trắc nghiệm của bạn</div>
              <div className='custom-test-result-modal__header__subscription center'>
                <span>Bạn đã làm đúng được </span>
                <span className='custom-test-result-modal__header__subscription__bold'>{`${correct ?? 0}/${
                  question_amount ?? 0
                }`}</span>
              </div>
              <div
                className={
                  correct >= fit_correct
                    ? 'custom-test-result-modal__header__pass__point'
                    : 'custom-test-result-modal__header__point'
                }
              >{`${correct ?? 0}/${question_amount ?? 0}`}</div>
            </div>
            <div className='custom-test-result-modal__footer flex justify-between'>
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
          <div className='custom-test-result-modal__header__empty-custom-test-result'>
            <div className='custom-test-result-modal__header__empty-custom-test-result__title'>
              {contentIQResult.title.yourResult}
            </div>
          </div>
          <div className='custom-test-result-page__content'>
            <div className='custom-test-result-page__content__empty-custom-test-result'>
              <b>{contentIQResult.gettingData}</b>
            </div>
            <div className='custom-test-result-page__content__testNow'>{contentIQResult.pleaseWait}</div>
          </div>
        </>
      )}
    </TemplatePage>
  )
}

export default CustomTestCampaignResultPage
