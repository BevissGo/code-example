import React from 'react'
import { Select } from 'antd'
import classNames from 'classnames'

import './style.scss'

const DashboardSelect = ({ className, ...props }) => {
  return <Select className={classNames('dashboard-select', className)} {...props} />
}

export default DashboardSelect
