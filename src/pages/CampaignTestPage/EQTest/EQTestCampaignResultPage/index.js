import './style.scss'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import i18nVN from 'i18n/locales/vn'
import Button from 'components/Button/Default'
import TemplatePage from 'containers/TemplatePage'
import { fetchInfoResult } from 'redux/services/discTestCampaign'
import { convertTotalTestTimeToString, redirectToWithPush, redirectToWithReplace } from 'utils'
import { EQResultPage as EQResultPageImgs } from 'constants/images'
import EQScore from './components/EQScore'
import LoadingContainer from './components/LoadingContainer'
import ListCharacteristics from './components/ListCharacteristics'

const EQTestCampaignResultPage = () => {
  const { campaign_id: campaignId, position_id: positionId } = useParams()

  const {
    pages: {
      eqTest: { eqResult: contentResult },
    },
  } = i18nVN.src

  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const loadingGetReport = useSelector((state) => state.report.loadingGet)
  const reportEQNewest = useSelector((state) => state.report.reportEQNewest)

  useEffect(() => {
    dispatch(
      fetchInfoResult(
        () => redirectToWithReplace(history, `/eq-test-campaign-result/${campaignId}/${positionId}`),
        location.pathname,
        campaignId,
        positionId,
      ),
    )
  }, [history, dispatch, location, campaignId, positionId])

  if (loadingGetReport) {
    return <LoadingContainer />
  } else if (!loadingGetReport && !reportEQNewest) {
    return (
      <TemplatePage namePage='eq-result-page__empty' typeHeader='expand'>
        <div className='eq-result-page__empty__title'>{contentResult.common.yourResult}</div>
        <div className='eq-result-page__empty__content'>
          <div className='eq-result-page__empty__content__empty-eq-result'>{contentResult.emptyEQResult}</div>
          <div className='eq-result-page__empty__content__testNow'>{contentResult.testNowToGetResult}</div>
          <Button
            label={contentResult.testNow}
            onClick={() => redirectToWithPush(history, `/eq-test-campaign/${campaignId}/${positionId}`)}
          />
        </div>
      </TemplatePage>
    )
  } else {
    return (
      <TemplatePage namePage='eq-result-page' typeHeader='expand'>
        <div className='eq-result-page__container'>
          <div className='eq-result-page__title'>{contentResult.common.yourResult}</div>
          <EQScore rank={reportEQNewest.rank} score={reportEQNewest.score} />

          <div className='eq-result-page__subscription'>
            <div>
              {contentResult.common.yourScoreTotal}{' '}
              <span className='eq-result-page__subscription__score-total'>{reportEQNewest.score}/64.</span>
            </div>
            <div>
              <span>
                {contentResult.common.totalTestTime} {convertTotalTestTimeToString(reportEQNewest?.finished_time)}
              </span>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: contentResult[reportEQNewest.rank].subscription,
              }}
            />
          </div>
          <div className='eq-result-page__content__title'>{contentResult.common.characteristics}</div>
          <ListCharacteristics listCharacteristics={contentResult[reportEQNewest.rank].listCharacteristics} />
          {reportEQNewest.rank === 'low' && (
            <div className='eq-result-page__content__expanded-characteristic'>
              {contentResult['low'].expandedCharacteristic}
            </div>
          )}
        </div>
        <div className='eq-result-page__container'>
          <div className='eq-result-page__container__how-to-practice-eq__title'>
            {contentResult.common.howToPracticeEQTitle}
          </div>
          <div className='eq-result-page__container__how-to-practice-eq__wrapper'>
            {contentResult.common.listWayToPracticeEQ.map((way, index) => (
              <div key={index} className='eq-result-page__container__how-to-practice-eq__wrapper__item'>
                <img
                  src={EQResultPageImgs[reportEQNewest.rank][index].src}
                  alt={EQResultPageImgs[reportEQNewest.rank][index].alt}
                />
                <div className='eq-result-page__container__how-to-practice-eq__wrapper__item__title'>{way.title}</div>
                <div className='eq-result-page__container__how-to-practice-eq__wrapper__item__content'>
                  {way.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </TemplatePage>
    )
  }
}

export default EQTestCampaignResultPage
