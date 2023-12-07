import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'

import Button from 'components/Button/Arrow'

import './style.scss'

const ModalInstructor = ({
  onStartSurvey,
  amountPageSurvey,
  loading,
  contentCommon,
  contentContainer,
}) => {
  return (
    <div className='modal-instructor'>
      <div className='modal-instructor__modal'>
        <ScrollAnimation
          offset={0}
          animateIn='animate__fadeIn'
          duration={0.75}
          animateOnce={true}
        >
          <p className='modal-instructor__header'>{contentContainer.title}</p>
        </ScrollAnimation>
        <ScrollAnimation
          offset={0}
          animateIn='animate__fadeIn'
          duration={0.75}
          animateOnce={true}
        >
          <div className='modal-instructor__body'>
            <span className='font-bold'>
              Chỉ chọn một câu phù hợp nhất (Most) và một câu không phù hợp nhất
              (Least) trong mỗi câu hỏi
            </span>.
            Bài khảo sát này không đánh giá cách trả lời{' '}
            <span className='font-bold'>&quot;đúng/sai&quot;</span> hay{' '}
            <span className='font-bold'>&quot;tốt/không tốt&quot;</span>. Hãy
            trả lời các câu hỏi một cách tự nhiên và thành thật nhất để có kết
            quả chính xác nhất cho chính bạn!
          </div>
        </ScrollAnimation>
        <div className='modal-instructor__footer'>
          <ScrollAnimation
            offset={0}
            animateIn='animate__fadeIn'
            duration={0.75}
            animateOnce={true}
          >
            <Button
              loading={loading}
              label={contentCommon.nextSurvey}
              disabled={amountPageSurvey === 0}
              onClick={onStartSurvey}
            />
          </ScrollAnimation>
        </div>
      </div>
    </div>
  )
}

export default ModalInstructor
