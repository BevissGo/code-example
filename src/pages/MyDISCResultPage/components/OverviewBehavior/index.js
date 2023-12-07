import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'

import './style.scss'

const OverviewBehavior = ({ contentBehavior }) => {
  return (
    <div className='overview-behavior-r'>
      <ScrollAnimation
        offset={0}
        animateIn='animate__fadeInLeft'
        duration={0.75}
        animateOnce={true}
      >
        <div className='overview-behavior-r__intro'>
          <p className='overview-behavior-r__title'>
            {contentBehavior.title}
          </p>

          <p
            className='overview-behavior-r__description'
            dangerouslySetInnerHTML={{
              __html: contentBehavior.description,
            }}
          ></p>
        </div>
      </ScrollAnimation>
      <div className='overview-behavior-r__list-article'>
        {contentBehavior.listBehavior.map((behavior, inx) => (
          <div key={inx} className='overview-behavior-r__list-article__item'>
            <ScrollAnimation
              offset={0}
              animateIn='animate__fadeInUp'
              duration={0.75}
              animateOnce={true}
            >
              <div className='overview-behavior-r__article'>
                <p className='overview-behavior-r__article__title'>
                  {behavior.title}
                </p>
                <p className='overview-behavior-r__article__description'>
                  {behavior.description}
                </p>
              </div>
            </ScrollAnimation>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OverviewBehavior
