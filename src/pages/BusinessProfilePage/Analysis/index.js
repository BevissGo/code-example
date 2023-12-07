import React from 'react'

import QuantityShow from './components/QuantityShow'

import './style.scss'

function Analysis({ campaignAmount }) {
  return (
    <div className='business-profile-analysis'>
      <QuantityShow color='#FFD4D4' title='Campaigns' quantity={campaignAmount} />
      {/* <QuantityShow color='#FFE9B0' title='Proceeded candidates' quantity='0' />
      <QuantityShow color='#D1D6DC' title='Proceeding candidates' quantity='24' /> */}
    </div>
  )
}

export default Analysis
