import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import i18nVN from 'i18n/locales/vn'

import { resultPage } from 'constants/images'
import { generateNameChart } from 'helpers'

import './style.scss'
import { convertTotalTestTimeToString, formatSeconds } from 'utils'

const MyDISCIntroResultPage = ({
  infoUser,
  listChart,
  listPersonality,
  loadingProfile,
  loadingReport,
  contentContainer,
  profilePattern,
}) => {

  const {
    pages: { result: contentPage },
  } = i18nVN.src

  const { listProfilePattern } = resultPage
  const exampleProfilePattern = {
    avatar: listProfilePattern[profilePattern.value]?.avatar,
    name: listProfilePattern[profilePattern.value]?.name,
  }

  return (
    <div className='my-disc-intro-result-page'>
      <div className='my-disc-intro-result-page__left'>
        <div className='my-disc-intro-result-page__overview'>
          <SkeletonTheme color='#f0f0f0' highlightColor='#fff'>
            <p className='my-disc-intro-result-page__overview__name'>
              {contentContainer.hello}{' '}
              {!loadingProfile ? (
                infoUser.name || 'DiSC'
              ) : (
                  <Skeleton width='180px' />
                )}
              !
            </p>
            <p className='my-disc-intro-result-page__overview__name'> 
              {contentPage.discResultIntro} {convertTotalTestTimeToString(formatSeconds(listChart?.finishedTime))} 
            </p>
          </SkeletonTheme>
          <SkeletonTheme color='#f0f0f0' highlightColor='#fff'>
            <div className='my-disc-intro-result-page__overview__modal'>
              {contentContainer.title}{' '}
              {!loadingReport ? (
                profilePattern.name || 'DiSC'
              ) : (
                  <Skeleton width='240px' />
                )}
            </div>
          </SkeletonTheme>
          <SkeletonTheme color='#f0f0f0' highlightColor='#fff'>
            <p className='my-disc-intro-result-page__overview__reason'>
              {contentContainer.description[0]}{' '}
              {!loadingReport ? (
                generateNameChart(listChart.least).join(', ') || 'DiSC'
              ) : (
                  <Skeleton width='50px' />
                )}{' '}
              {contentContainer.description[1]}
            </p>
          </SkeletonTheme>
        </div>
        <ul className='my-disc-intro-result-page__list-character'>
          {listPersonality.map((personality, inx) => (
            <li key={inx}>
              <SkeletonTheme color='#f0f0f0' highlightColor='#fff'>
                <span>
                  {!loadingReport ? (
                    personality.value || 'DiSC'
                  ) : (
                      <Skeleton height={30} />
                    )}
                </span>
              </SkeletonTheme>
            </li>
          ))}
        </ul>
      </div>
      <div className='my-disc-intro-result-page__right'>
        <SkeletonTheme color='#f0f0f0' highlightColor='#fff'>
          {loadingReport ? (
            <Skeleton height={350} width={290} />
          ) : (
              <img src={exampleProfilePattern.avatar} alt='' />
            )}
        </SkeletonTheme>
      </div>
    </div>
  )
}

export default MyDISCIntroResultPage
