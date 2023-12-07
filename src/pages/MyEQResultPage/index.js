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
import HowToPracticeEQ from './containers/HowToPracticeEQ'
import EQScore from './components/EQScore'
import ModalShare from './components/ModalShare'
import LoadingContainer from './components/LoadingContainer'
import MyEQSharingResult from './components/MyEQSharingResult'
import ListCharacteristics from './components/ListCharacteristics'

import './style.scss'

const MyEQResultPage = () => {
  const location = useLocation()
  const {
    pages: { result: contentPage },
  } = i18nVN.src

  const {
    pages: {
      eqTest: { eqResult: contentResult },
    },
    timeUnit
  } = i18nVN.src

  const dispatch = useDispatch()
  const history = useHistory()

  const [isShowShareModal, setShowShareModal] = useState(false)
  const [openDropdownResult, setOpenDropdownResult] = useState(false)

  const infoUser = useSelector((state) => state.profile.profile)
  const loadingGetProfile = useSelector((state) => state.profile.loadingGet)
  const loadingGetReport = useSelector((state) => state.report.loadingGet)
  const reportEQNewest = useSelector((state) => state.report.reportEQNewest)

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
        () => redirectToWithReplace(history, '/my-eq-result'),
        location.pathname
      )
    )
  }, [history, dispatch, location])

  const renderResult = (
    loadingGetProfile,
    loadingGetReport,
  ) => {
    if (loadingGetProfile || loadingGetReport) {
      return <LoadingContainer />
    } else if (
      !reportEQNewest
    ) {
      return (
        <>
          {openDropdownResult && (
            <DropdownResult
              onClose={handleCloseDropdownResult}
              contentCommon={contentPage}
              activeResult='eqResult'
            />
          )}
          <div className='my-eq-result-page__content'>
            <div className='my-eq-result-page__content__empty-eq-result'>
              {contentPage.emptyEQResult}
            </div>
            <div className='my-eq-result-page__content__testNow'>
              {contentPage.testNowToGetResult}
            </div>
            <Button
              label={contentPage.testNow}
              onClick={() => redirectToWithPush(history, '/eq-test')}
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
              activeResult='eqResult'
            />
          )}
          <div className='my-eq-result-page__content'>
            <EQScore rank={reportEQNewest.rank} score={reportEQNewest.score} />
            <div className='my-eq-result-page__overview'>
              <div className='my-eq-result-page__subscription'>
                <div>
                  {contentResult.common.yourScoreTotal}{' '}
                  <span className='my-eq-result-page__subscription__score-total'>
                    {reportEQNewest.score}/64&nbsp;
                  </span>
                  <span>{convertTotalTestTimeToString(formatSeconds(reportEQNewest.finished_time), timeUnit)}</span>
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: contentResult[reportEQNewest.rank].subscription,
                  }}
                />
              </div>
              <div className='my-eq-result-page__content__title'>
                {contentResult.common.characteristics}
              </div>
              <ListCharacteristics
                listCharacteristics={
                  contentResult[reportEQNewest.rank].listCharacteristics
                }
              />
              {reportEQNewest.rank === 'low' && (
                <div className='my-eq-result-page__content__expanded-characteristic'>
                  {contentResult['low'].expandedCharacteristic}
                </div>
              )}
            </div>
            <HowToPracticeEQ
              rank={reportEQNewest.rank}
              contentResult={contentResult.common}
            />
          </div>
          <MyEQSharingResult
            infoUser={infoUser}
            contentContainer={contentPage.sharing}
          />
        </>
      )
    }
  }

  return (
    <>
      <TemplatePage namePage='my-eq-result-page' typeHeader='expand'>
        <div className='my-eq-result-page__title'>{contentPage.title}</div>
        <div className='my-eq-result-page__tab'>
          <div
            className='my-eq-result-page__tab__active'
            onClick={handleOpenDropdownResult}
          >
            {contentPage.eqResult}
            <img src={arrowDown} alt='' />
          </div>
        </div>
        {renderResult(loadingGetProfile, loadingGetReport)}
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

export default MyEQResultPage
