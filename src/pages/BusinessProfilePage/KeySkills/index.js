import React from 'react'

import DetailBox from '../components/DetailBox'

import './style.scss'

function KeySkills({ contents }) {
  return (
    <DetailBox title='Key skills'>
      <div className='business-profile-keyskills'>
        {contents?.map((content, index) => (
          <p key={index} className='business-profile-keyskills__item'>
            {content}
          </p>))}
      </div>
    </DetailBox>
  )
}

export default KeySkills
