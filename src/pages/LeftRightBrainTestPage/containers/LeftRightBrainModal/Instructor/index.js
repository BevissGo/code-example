import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'

import Button from 'components/Button/Default'

import './style.scss'

const LeftRightBrainModalInstructor = ({ onStartSurvey, contentContainer, amountPageSurvey }) => {
  return (
    <div className='lr-brain-modal-instructor'>
      <div className='lr-brain-modal-instructor__modal'>
        <ScrollAnimation
          offset={0}
          animateIn='animate__fadeIn'
          duration={0.75}
          animateOnce={true}
        >
          <p className='lr-brain-modal-instructor__header'>
            {contentContainer.title}
          </p>
        </ScrollAnimation>
        <ScrollAnimation
          offset={0}
          animateIn='animate__fadeIn'
          duration={0.75}
          animateOnce={true}
        >
          <div className='lr-brain-modal-instructor__body'>
            <div>{contentContainer.content}</div>
            <div className='lr-brain-modal-instructor__body__exam_structure'>
              {contentContainer.exam_structure.title}
            </div>
            <ul>
              <li>{contentContainer.exam_structure.numberOfQuestions}</li>
              <li>{contentContainer.exam_structure.time}</li>
              <li>{contentContainer.exam_structure.form}</li>
            </ul>
          </div>
        </ScrollAnimation>
        <div className='lr-brain-modal-instructor__footer'>
          <ScrollAnimation
            offset={0}
            animateIn='animate__fadeIn'
            duration={0.75}
            animateOnce={true}
          >
            <Button
              label={contentContainer.ready} 
              isDisabled={amountPageSurvey === 0}
              onClick={onStartSurvey} 
            />
          </ScrollAnimation>
        </div>
      </div>
    </div>
  )
}

export default LeftRightBrainModalInstructor
