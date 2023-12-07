import React from 'react'

import './style.scss'

const DashboardBar = ({ title, rightItem }) => {
  return (
    <div className='dashboard-bar'>
      <div className='dashboard-bar__title'>
        {title}
      </div>
      <div className='dashboard-bar__action'>{rightItem}</div>
    </div>
  )
}

export default DashboardBar