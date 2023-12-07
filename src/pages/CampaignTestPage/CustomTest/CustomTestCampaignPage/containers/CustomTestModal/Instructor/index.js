import './style.scss'
import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import ButtonArrow from 'components/Button/Arrow'

const CustomTestModalInstructor = ({ position, onStartSurvey, contentContainer, amountPageSurvey, loading, test }) => {
  return (
    <div className='custom-test-modal-instructor'>
      <div className='custom-test-modal-instructor__modal'>
        <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
          <p className='custom-test-modal-instructor__header'>Bài kiểm tra trắc nghiệm</p>
        </ScrollAnimation>
        <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
          <div className='custom-test-modal-instructor__body'>
            <div>
              Đây là bài kiểm tra do doanh nghiệp tự thêm dưới hình thức trắc nghiệm, mỗi câu hỏi bạn chỉ được chọn 1
              đáp án duy nhất.
            </div>
            {!!Object.values(position)?.length && (
              <>
                <div className='custom-test-modal-instructor__body__exam_structure'>
                  {contentContainer.exam_structure.title}
                </div>
                <ul>
                  <li>{`Số câu hỏi: ${test?.test_id?.question_list?.length} câu hỏi`}</li>
                  {test?.test_id?.duration_time ? (
                    <li>{`Thời gian làm bài: ${test?.test_id?.duration_time} phút`}</li>
                  ) : (
                    <li>{'Thời gian làm bài: vô thời hạn'}</li>
                  )}
                  <li>{contentContainer.exam_structure.form}</li>
                </ul>
              </>
            )}
          </div>
        </ScrollAnimation>
        <div className='custom-test-modal-instructor__footer'>
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

export default CustomTestModalInstructor
