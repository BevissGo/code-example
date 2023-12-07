import React from 'react'
import Scrollspy from 'react-scrollspy'
import ScrollAnimation from 'react-animate-on-scroll'

import i18nPremiumVN from 'i18n/locales/vn.js'
import OverviewBehavior from '../../components/OverviewBehavior'

import './style.scss'

const MeaningResult = () => {
  const listSpy = [
    { name: 'D', id: 'behavior-d' },
    { name: 'i', id: 'behavior-i' },
    { name: 'S', id: 'behavior-s' },
    { name: 'C', id: 'behavior-c' },
  ]

  const {
    pages: {
      result: { meaning: contentContainer },
    },
  } = i18nPremiumVN.src

  const handleClickScrollspy = (nameElement) => {
    window.scrollTo({
      top:
        document.getElementById(nameElement).getBoundingClientRect().top +
        window.pageYOffset -
        140,
      behavior: 'smooth',
    })
  }

  const handleActionScrollSpy = (typeAction) => {
    const indexCurrent = listSpy.findIndex(
      (spy) =>
        spy.name === document.getElementsByClassName('active-spy')[0].innerHTML
    )

    switch (typeAction) {
      case 'next':
        if (indexCurrent === 3) return
        handleClickScrollspy(listSpy[indexCurrent + 1].id)
        break
      case 'back':
        if (indexCurrent === 0) return
        handleClickScrollspy(listSpy[indexCurrent - 1].id)
        break
      default:
        break
    }
  }

  return (
    <div className='meaning-result-r'>
      <div className='meaning-result-r__list-action'>
        <ul className='meaning-result-r__list-action__scrollspy'>
          <ScrollAnimation
            offset={0}
            animateIn='animate__fadeInRight'
            duration={0.75}
            animateOut='animate__fadeOutRight'
          // animateOnce={true}
          >
            <li
              className='action'
              onClick={() => handleActionScrollSpy('back')}
            >
              <span>&#8249;</span>
            </li>
            <Scrollspy
              items={listSpy.map((spy) => spy.id)}
              currentClassName='active-spy'
              offset={-140}
            >
              {listSpy.map((spy, inx) => (
                <li key={inx} onClick={() => handleClickScrollspy(spy.id)}>
                  {spy.name}
                </li>
              ))}
            </Scrollspy>
            <li
              className='action'
              onClick={() => handleActionScrollSpy('next')}
            >
              <span>&#8249;</span>
            </li>
          </ScrollAnimation>
        </ul>
      </div>
      <div className='meaning-result-r__background'>
        <ScrollAnimation
          offset={0}
          animateIn='animate__fadeIn'
          duration={0.75}
          animateOnce={true}
        >
          <p className='meaning-result-r__title'>
            {contentContainer.title}
          </p>
        </ScrollAnimation>
        <div className='meaning-result-r__list-behavior' style={{
          position: 'relative'
        }}>
          {contentContainer.content.map((contentBehavior, inx) => {
            return (
              <div key={inx} id={listSpy[inx].id}>
                <OverviewBehavior contentBehavior={contentBehavior} />
                {inx !== contentContainer.content.length - 1 && (
                  <div className='line-break'></div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MeaningResult
