import React from 'react'

import ScrollAnimation from 'react-animate-on-scroll'
import ButtonArrow from 'components/Button/Arrow'

import './style.scss'

const EQModalInstructor = ({ onStartSurvey, contentContainer, amountPageSurvey }) => {
  return (
    <div className='eq-modal-instructor'>
      <div className='eq-modal-instructor__modal'>
        <ScrollAnimation
          offset={0}
          animateIn='animate__fadeIn'
          duration={0.75}
          animateOnce={true}
        >
          <p className='eq-modal-instructor__header'>
            {contentContainer.title}
          </p>
        </ScrollAnimation>
        <ScrollAnimation
          offset={0}
          animateIn='animate__fadeIn'
          duration={0.75}
          animateOnce={true}
        >
          <div className='eq-modal-instructor__body'>
            <div>{contentContainer.content}</div>
            <div className='eq-modal-instructor__body__exam_structure'>
              {contentContainer.exam_structure.title}
            </div>
            <ul>
              <li>{contentContainer.exam_structure.numberOfQuestions}</li>
              <li>{contentContainer.exam_structure.time}</li>
              <li>{contentContainer.exam_structure.form}</li>
            </ul>
          </div>
        </ScrollAnimation>
        <div className='eq-modal-instructor__footer'>
          <ScrollAnimation
            offset={0}
            animateIn='animate__fadeIn'
            duration={0.75}
            animateOnce={true}
          >
            <ButtonArrow
              disabled={amountPageSurvey === 0}
              label={contentContainer.continue}
              onClick={onStartSurvey}
            />
          </ScrollAnimation>
        </div>
      </div>
    </div>
  )
}

export default EQModalInstructor
