import React from 'react'

import DetailBox from '../components/DetailBox'

import './style.scss'

function Address({ contents }) {
  const midpoint = Math.floor(contents?.length / 2)
  const firstArray = contents?.slice(0, midpoint)
  const secondArray = contents?.slice(midpoint)

  return (
    <DetailBox title='Address'>
      <div className='business-profile-address'>
        <div className='business-profile-address__item'>
          <ul>
            {secondArray?.map((e, inx) => <li key={inx}>{e}</li>)}
          </ul>
        </div>
        <div className='business-profile-address__item'>
          <ul>
            {firstArray?.map((e, inx) => <li key={inx}>{e}</li>)}
          </ul>
        </div>
      </div>
    </DetailBox>
  )
}

export default Address
