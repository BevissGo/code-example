import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import i18nVN from 'i18n/locales/vn'
import Button from 'components/Button/Default'
import TemplatePage from 'containers/TemplatePage'
import { fetchInfoResult } from 'redux/services/report'
import { redirectToWithPush, redirectToWithReplace, convertTotalTestTimeToString, formatSeconds } from 'utils'
import { EQResultPage as EQResultPageImgs } from 'constants/images'
import EQSharingResult from './containers/EQSharingResult'
import EQScore from './components/EQScore'
import LoadingContainer from './components/LoadingContainer'
import ListCharacteristics from './components/ListCharacteristics'

import './style.scss'

const EQResultPage = () => {
  const {
    pages: {
      eqTest: { eqResult: contentResult },
    },
    timeUnit,
  } = i18nVN.src

  const {
    pages: { result: contentPage },
  } = i18nVN.src

  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const loadingGetReport = useSelector((state) => state.report.loadingGet)
  const reportEQNewest = useSelector((state) => state.report.reportEQNewest)
  const infoUser = useSelector((state) => state.profile.profile)

  useEffect(() => {
    dispatch(fetchInfoResult(() => redirectToWithReplace(history, '/eq-result'), location.pathname))
  }, [history, dispatch, location])

  if (loadingGetReport) {
    return <LoadingContainer />
  } else if (!loadingGetReport && !reportEQNewest) {
    return (
      <TemplatePage namePage='eq-result-page__empty' typeHeader='expand'>
        <div className='eq-result-page__empty__title'>{contentResult.common.yourResult}</div>
        <div className='eq-result-page__empty__content'>
          <div className='eq-result-page__empty__content__empty-eq-result'>{contentResult.emptyEQResult}</div>
          <div className='eq-result-page__empty__content__testNow'>{contentResult.testNowToGetResult}</div>
          <Button label={contentResult.testNow} onClick={() => redirectToWithPush(history, '/eq-test')} />
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
              <span className='eq-result-page__subscription__score-total'>{reportEQNewest.score}/64&nbsp;</span>
              <span>{convertTotalTestTimeToString(formatSeconds(reportEQNewest.finished_time), timeUnit)}</span>
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
        <EQSharingResult infoUser={infoUser} contentContainer={contentPage.sharing} />
      </TemplatePage>
    )
  }
}

export default EQResultPage
