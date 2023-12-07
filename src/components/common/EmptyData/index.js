import React from 'react'
import { Empty } from 'antd'

import './style.scss'

const EmptyData = ({ message = 'No data' }) => {
  return (
    <div className='empty-data-view'>
      <Empty description={false} />
      <div className='empty-data-view__message'>{message}</div>
    </div>
  )
}

export default EmptyData
