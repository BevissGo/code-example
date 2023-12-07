import './style.scss'
import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import ButtonArrow from 'components/Button/Arrow'

const SingleChoiceModalInstructor = ({ position, onStartSurvey, contentContainer, amountPageSurvey, loading }) => {
  return (
    <div className='eq-modal-instructor'>
      <div className='eq-modal-instructor__modal'>
        <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
          <p className='eq-modal-instructor__header'>Bài kiểm tra trắc nghiệm</p>
        </ScrollAnimation>
        <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
          <div className='eq-modal-instructor__body'>
            <div>
              Đây là bài kiểm tra do doanh nghiệp tự thêm dưới hình thức trắc nghiệm, mỗi câu hỏi bạn chỉ được chọn 1
              đáp án duy nhất.
            </div>
            {!!Object.values(position)?.length && (
              <>
                <div className='eq-modal-instructor__body__exam_structure'>{contentContainer.exam_structure.title}</div>
                <ul>
                  <li>{`Số câu hỏi: ${position?.single_choice_questions?.length} câu hỏi`}</li>
                  <li>{`Thời gian làm bài: ${position?.single_choice_time} phút`}</li>
                  <li>{contentContainer.exam_structure.form}</li>
                </ul>
              </>
            )}
          </div>
        </ScrollAnimation>
        <div className='eq-modal-instructor__footer'>
          <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
            <ButtonArrow
              disabled={loading || amountPageSurvey === 0}
              label={contentContainer.continue}
              onClick={onStartSurvey}
              loading={loading}
            />
          </ScrollAnimation>
        </div>
      </div>
    </div>
  )
}

export default SingleChoiceModalInstructor
