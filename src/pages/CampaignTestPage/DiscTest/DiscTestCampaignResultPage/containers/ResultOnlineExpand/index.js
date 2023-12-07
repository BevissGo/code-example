import React from 'react'
import { useSelector } from 'react-redux'
import ScrollAnimation from 'react-animate-on-scroll'

import LineChart from 'components/LineChart'

import i18nPremiumVN from 'i18n/locales/premiumVN.js'

import './style.scss'

const ResultOnlineExpand = ({ listChart }) => {
  const profilePattern = useSelector((state) => state.report.profilePattern)

  const {
    pages: {
      result: { resultOnline: contentContainerPremium },
    },
  } = i18nPremiumVN.src

  const listDescriptionCharacter = profilePattern.overview || []

  return (
    <div className='result-online--expand'>
      <div className='result-online--expand__intro__overview'>
        <ScrollAnimation
          offset={0}
          animateIn='animate__fadeInLeft'
          duration={0.75}
          animateOnce={true}
        >
          <p className='result-online--expand__intro__overview__title'>
            {contentContainerPremium.title}
          </p>
        </ScrollAnimation>
      </div>

      <div className='result-online--expand__intro__chart'>
        <ScrollAnimation
          offset={0}
          animateIn='animate__fadeInRight'
          duration={0.75}
          animateOnce={true}
        >
          <p className='result-online--expand__intro__chart__title'>
            {contentContainerPremium.titleChart}
          </p>

          <LineChart dataChart={Object.values(listChart['difference'])} />
        </ScrollAnimation>
      </div>
      <div className='result-online--expand__meaning-result'>
        <ScrollAnimation
          offset={0}
          animateIn='animate__fadeIn'
          duration={0.75}
          animateOnce={true}
        >
          <p className='result-online--expand__meaning-result__title'>
            {contentContainerPremium.titleOverview}
          </p>
        </ScrollAnimation>
        <div className='result-online--expand__meaning-result__list-description'>
          {listDescriptionCharacter.map((description, inx) => (
            <div
              key={inx}
              className='result-online--expand__meaning-result__description'
            >
              <ScrollAnimation
                offset={0}
                animateIn='animate__fadeInUp'
                duration={0.75}
                animateOnce={true}
              >
                <span>{description}</span>
              </ScrollAnimation>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ResultOnlineExpand
