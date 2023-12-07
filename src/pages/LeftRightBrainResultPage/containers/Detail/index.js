import React from 'react'

import ScrollAnimation from 'react-animate-on-scroll'
import { brainResultPage } from 'constants/images'

import './style.scss'

const Detail = ({ side, contentCommon, contentDetail }) => {
  return (
    <div className='detail'>
      <div className='detail__wrapper'>
        <div className='detail__left-column col-12 col-mid-lg-6'>
          <ScrollAnimation offset={0} animateIn='animate__fadeInUp' duration={0.75} animateOnce={true}>
            <div className='detail__title'>
              <span className={`detail__title__line ${side}`}></span>&nbsp;
              <span className='detail__title-content'>{contentCommon.characteristics}</span>
            </div>
            <p className='detail__content'>
              {contentDetail?.characteristicsSub[0]}
              <br />
              <br />
              {contentDetail?.characteristicsSub[1]}
            </p>
          </ScrollAnimation>

          <div className='detail__left-column__image'>
            <ScrollAnimation offset={0} animateIn='animate__fadeInRight' duration={0.75} animateOnce={true}>
              <img src={brainResultPage[side]?.detail.src} alt={brainResultPage[side]?.detail.src || ''} />
            </ScrollAnimation>
          </div>

          <ScrollAnimation offset={0} animateIn='animate__fadeInUp' duration={0.75} animateOnce={true}>
            <div className='detail__title'>
              <span className={`detail__title__line ${side}`}></span>&nbsp;
              <span className='detail__title-content special-personality'>{contentCommon.specialPersonality}</span>
            </div>
            <div className='detail__content'>
              <ul>
                {contentDetail?.listPersonality.map((personality, index) => (
                  <li key={index}>{personality}</li>
                ))}
              </ul>
            </div>
          </ScrollAnimation>
        </div>
        <div className='detail__right-column col-12 col-mid-lg-6'>
          <div className='detail__right-column__image'>
            <ScrollAnimation offset={0} animateIn='animate__fadeInRight' duration={0.75} animateOnce={true}>
              <img src={brainResultPage[side]?.detail.src} alt={brainResultPage[side]?.detail.alt || ''} />
            </ScrollAnimation>
          </div>
        </div>
      </div>

      <div className='detail__wrapper'>
        <div className='col-12 col-mid-lg-6'>
          <ScrollAnimation offset={0} animateIn='animate__fadeInUp' duration={0.75} animateOnce={true}>
            <div className='detail__title'>
              <span className={`detail__title__line ${side}`}></span>&nbsp;
              <span className='detail__title-content learning-method'>{contentCommon.learningMethod}</span>
            </div>
            <div className='detail__content'>
              <ul>
                {contentDetail?.listLearningMethod.map((learningMethod, index) => (
                  <li className='detail__content__item' key={index}>
                    <b>{learningMethod.title}: </b>
                    {learningMethod.subscription}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollAnimation>
        </div>
        <div className='col-12 col-mid-lg-6'>
          <ScrollAnimation offset={0} animateIn='animate__fadeInUp' duration={0.75} animateOnce={true}>
            <div className='detail__title'>
              <span className={`detail__title__line ${side}`}></span>&nbsp;
              <span className='detail__title-content'>{contentCommon.advice}</span>
            </div>
            <div className='detail__content'>
              <ul>
                {contentDetail?.listAdvice.map((advice, index) => (
                  <li className='detail__content__item' key={index}>
                    {advice}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollAnimation>
        </div>
      </div>

      <div>
        <ScrollAnimation offset={0} animateIn='animate__fadeInUp' duration={0.75} animateOnce={true}>
          <div className='detail__title'>
            <span className={`detail__title__line ${side}`}></span>&nbsp;
            <span className='detail__title-content'>{contentCommon.suitableOccupation}</span>
          </div>
          <p className='detail__content'>{contentDetail.suitableOccupation.subscription}</p>
        </ScrollAnimation>
        <div className='detail__list-occupation'>
          {contentDetail.suitableOccupation.listOccupation.map((occupation, index) => (
            <div className='detail__list-occupation__occupation col-12 col-mid-lg-4 col-mid-md-6' key={index}>
              <ScrollAnimation offset={0} animateIn='animate__fadeInUp' duration={0.75} animateOnce={true}>
                <img
                  src={brainResultPage[side].listOccupation[index].src}
                  alt={brainResultPage[side].listOccupation[index].alt}
                />
                <p className={`detail__list-occupation__occupation__title ${side}`}>{occupation.title}</p>
                <p className='detail__list-occupation__occupation__content'>{occupation.subscription}</p>
              </ScrollAnimation>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Detail
