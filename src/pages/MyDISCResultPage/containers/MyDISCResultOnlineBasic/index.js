import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import ScrollAnimation from 'react-animate-on-scroll'

import LineChart from 'components/LineChart'

import { generateNameChart } from 'helpers'

import './style.scss'

const MyDISCResultOnlineBasic = ({ listChart, contentContainer }) => {
  const { most, least } = listChart

  return (
    <div className='my-disc-result-online--basic'>
      <div className='my-disc-result-online--basic__overview'>
        <ScrollAnimation
          offset={0}
          animateIn='animate__fadeInDown'
          duration={0.75}
          animateOnce={true}
        >
          <p className='my-disc-result-online--basic__overview__title'>
            {contentContainer.title}
          </p>
        </ScrollAnimation>
        <div className='my-disc-result-online--basic__overview__meaning'>
          <div className='left col-12 col-mid-md-6'>
            <ScrollAnimation
              offset={0}
              animateIn='animate__fadeInLeft'
              duration={0.75}
              animateOnce={true}
            >
              <span>{contentContainer.description[0]}</span>
            </ScrollAnimation>
          </div>
          <div className='right col-12 col-mid-md-6'>
            <ScrollAnimation
              offset={0}
              animateIn='animate__fadeInRight'
              duration={0.75}
              animateOnce={true}
            >
              <span>{contentContainer.description[1]}</span>
            </ScrollAnimation>
          </div>
        </div>
      </div>
      <div className='my-disc-result-online--basic__list-chart'>
        <div className='my-disc-result-online--basic__chart--left'>
          <ScrollAnimation
            offset={0}
            animateIn='animate__fadeInLeft'
            duration={0.75}
            animateOnce={true}
          >
            <SkeletonTheme color='#f0f0f0' highlightColor='#fff'>
              <p className='my-disc-result-online--basic__chart__title'>
                {contentContainer.titleChart.most.title} -{' '}
                {generateNameChart(most).join('') || <Skeleton width='40px' />}
              </p>
            </SkeletonTheme>
            <p className='my-disc-result-online--basic__chart__subscription'>
              {contentContainer.titleChart.most.subscription}
            </p>
            <LineChart dataChart={Object.values(listChart['most'])} />
          </ScrollAnimation>
        </div>
        <div className='my-disc-result-online--basic__chart--right'>
          <ScrollAnimation
            offset={0}
            animateIn='animate__fadeInRight'
            duration={0.75}
            animateOnce={true}
          >
            <SkeletonTheme color='#f0f0f0' highlightColor='#fff'>
              <p className='my-disc-result-online--basic__chart__title'>
                {contentContainer.titleChart.least.title} -{' '}
                {generateNameChart(least).join('') || <Skeleton width='40px' />}
              </p>
            </SkeletonTheme>
            <p className='my-disc-result-online--basic__chart__subscription'>
              {contentContainer.titleChart.least.subscription}
            </p>
            <LineChart dataChart={Object.values(listChart['least'])} />
          </ScrollAnimation>
        </div>
      </div>
      <ScrollAnimation
        offset={0}
        animateIn='animate__fadeInUp'
        duration={0.75}
        animateOnce={true}
      >
      </ScrollAnimation>
    </div>
  )
}

export default MyDISCResultOnlineBasic
