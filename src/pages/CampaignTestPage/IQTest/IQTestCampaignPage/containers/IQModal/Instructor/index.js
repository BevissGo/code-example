import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'

import Button from 'components/Button/Default'

import './style.scss'

const IQModalInstructor = ({ loading, onStartSurvey, amountPageSurvey, contentContainer }) => {
  return (
    <div className='iq-modal-instructor'>
      <div className='iq-modal-instructor__modal'>
        <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
          <p className='iq-modal-instructor__header'>{contentContainer.title}</p>
        </ScrollAnimation>
        <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
          <div className='iq-modal-instructor__body'>
            <div>
              IQ trong tiếng anh là viết tắt của “lntelligent Quotient” được hiểu đơn giản là chỉ số thông minh của con
              người và được dùng trong tâm lý học để đánh giá trí thông minh của một người. Nhắc đến chỉ số IQ cao,
              người ta thường nghĩ đến sự thông minh và ngược lại. Những người có chỉ số IQ cao thường là những người có
              khả năng vận dụng, xử lý và phân tích thông tin ở mức độ chuyên sâu và tốc độ nhanh hơn những người có chỉ
              số IQ thấp.
            </div>
            <div>
              Các bạn sẽ được làm bài test <span className='font-bold'>trắc nghiệm IQ online miễn phí</span> để đo IQ
              của mình ngay dưới đây!
            </div>
            <div className='iq-modal-instructor__body__exam_structure'>Cấu trúc bài kiểm tra</div>
            <div>- Số câu hỏi: 25 câu</div>
            <div>- Thời gian làm bài: 30 phút</div>
            <div>- Hình thức: Trắc nghiệm bằng hình ảnh</div>
            <div className='iq-modal-instructor__body__note'>
              Lưu ý: Không tải lại trang hay bấm F5 trong quá trình làm bài nếu không sẽ mất dữ liệu bài làm!
            </div>
          </div>
        </ScrollAnimation>
        <div className='iq-modal-instructor__footer'>
          <ScrollAnimation offset={0} animateIn='animate__fadeIn' duration={0.75} animateOnce={true}>
            <Button
              loading={loading}
              label={contentContainer.ready}
              disabled={amountPageSurvey === 0}
              onClick={onStartSurvey}
            />
          </ScrollAnimation>
        </div>
      </div>
    </div>
  )
}

export default IQModalInstructor
