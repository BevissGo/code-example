import React from 'react'

import DetailBox from '../components/DetailBox'

import './style.scss'

function Services({ contents }) {
  return (
    <DetailBox title='Services'>
      <div className='business-profile-services'>
        {contents?.map((content, index) => (
          <p key={index} className='business-profile-services__item'>
            {content}
          </p>))}
      </div>
    </DetailBox>
  )
}

export default Services
