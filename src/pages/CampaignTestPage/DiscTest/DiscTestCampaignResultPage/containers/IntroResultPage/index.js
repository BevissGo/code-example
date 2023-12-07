import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import { resultPage } from 'constants/images'
import { generateNameChart } from 'helpers'

import './style.scss'
import { convertTotalTestTimeToString } from 'utils'

const IntroResultPage = ({
  infoUser,
  listChart,
  listPersonality,
  reportDiscNewest,
  loadingProfile,
  loadingReport,
  contentContainer,
  profilePattern
}) => {

  const { listProfilePattern } = resultPage
  const exampleProfilePattern = {
    avatar: listProfilePattern[profilePattern.value]?.avatar,
    name: listProfilePattern[profilePattern.value]?.name,
  }


  console.log('reportDiscNewest: ', reportDiscNewest)
  return (
    <div className='intro-result-page'>
      <div className='intro-result-page__left'>
        <div className='intro-result-page__overview'>
          <SkeletonTheme color='#f0f0f0' highlightColor='#fff'>
            <p className='intro-result-page__overview__name'>
              {contentContainer.hello}{' '}
              {!loadingProfile ? (
                infoUser.name || 'DiSC'
              ) : (
                  <Skeleton width='180px' />
                )}
              ! 
            </p>
            <p className='intro-result-page__overview__name'>{contentContainer.duration}{' '}
            {reportDiscNewest?.finished_time ? convertTotalTestTimeToString(reportDiscNewest?.finished_time) : null}
            </p>
          </SkeletonTheme>
          <SkeletonTheme color='#f0f0f0' highlightColor='#fff'>
            <div className='intro-result-page__overview__modal'>
              {contentContainer.title}{' '}
              {!loadingReport ? (
                profilePattern.name || 'DiSC'
              ) : (
                  <Skeleton width='240px' />
                )}
            </div>
          </SkeletonTheme>
          <SkeletonTheme color='#f0f0f0' highlightColor='#fff'>
            <p className='intro-result-page__overview__reason'>
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
        <ul className='intro-result-page__list-character'>
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
      <div className='intro-result-page__right'>
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

export default IntroResultPage
