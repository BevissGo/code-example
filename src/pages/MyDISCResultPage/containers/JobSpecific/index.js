import React from 'react'
import { useSelector } from 'react-redux'
import ScrollAnimation from 'react-animate-on-scroll'

import avatarJobExample from 'assets/images/jobs/test.svg'

import './style.scss'

const JobSpecific = () => {
  const profilePattern = useSelector((state) => state.report.profilePattern)

  const listJobSpecific = profilePattern?.listJobSpecific || []

  return (
    <div className='job-specific'>
      <ScrollAnimation
        offset={0}
        animateIn='animate__fadeInLeft'
        duration={0.75}
        animateOnce={true}
      >
        <div className='job-specific__intro'>
          <p className='job-specific__intro__title'>Công việc phù hợp</p>
          <p className='job-specific__intro__description'>
            Là một người thuyết phục, bạn dễ ảnh hưởng, tạo cảm hứng và khiến
            thay đổi hành vi của người khác. Vậy nên, bạn sẽ phù hợp với các
            công việc sử dụng ngôn ngữ nhiều, các công việc mang tính chất
            truyền tải thông tin và đòi hỏi trách nhiệm cao.
          </p>
        </div>
      </ScrollAnimation>
      <div className='job-specific__list-job'>
        {listJobSpecific.map((job, inx) => (
          <div key={inx} className='job-specific__job'>
            <ScrollAnimation
              offset={0}
              animateIn='animate__fadeInUp'
              duration={0.75}
              animateOnce={true}
            >
              <img src={avatarJobExample} alt='' />
              <p className='job-specific__job__title'>{job.title}</p>
              <p className='job-specific__job__description'>
                {job.description}
              </p>
            </ScrollAnimation>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobSpecific
