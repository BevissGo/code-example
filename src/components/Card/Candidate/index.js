import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { StarOutlined, StarFilled } from '@ant-design/icons'

import { ItemTypes } from 'pages/CandidatesPage/Group/constants'
import { ReactComponent as IconGmail } from 'assets/images/dashboard/cib_gmail.svg'
import { ReactComponent as IconPhone } from 'assets/images/dashboard/bi_telephone.svg'

import './style.scss'

const CandidateCard = ({ candidate }) => {
  // const sampleCandidate = {
  //     id: 1,
  //     avatar: '/2.png',
  //     name: 'John Doe',
  //     role: 'Frontend developer',
  //     email: 'john.doe@gmail.com',
  //     tel: '+380991234567',
  //     status: 'Applied',
  //     stared: false,
  // }
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CANDIDATE,
    item: candidate,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      item: monitor.getItem(),
    }),
  }))

  const [star, setStar] = useState(candidate.stared)

  const toggleStar = () => {
    setStar(curr => {
      candidate.stared = !curr
      return !curr
    })
  }

  return (
    <div className='candidate_card__container' ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move', }}>
      <div className='candidate_card'>
        <div className='header'>
          <div className='avatar'>
            <img src={candidate.avatar} alt='avatar' />
          </div>
          <div className='name'>
            <div className='star'>
              {star ? <StarFilled onClick={toggleStar} /> : <StarOutlined onClick={toggleStar} />}
            </div>
            <div className='name'>
              <span>{candidate.name}</span>
            </div>
          </div>
        </div>
        <div className='body'>
          <div className='apply-for'>
            <span className='title'>Apply for </span>
            <span className='value'>{candidate.role}</span>
          </div>
          <div className='info'>
            <div className='field'>
              <IconGmail />
            </div>
            <div className='value'>
              {candidate.email}
            </div>
          </div>
          <div className='info'>
            <div className='field'>
              <IconPhone />
            </div>
            <div className='value'>
              {candidate.tel}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateCard