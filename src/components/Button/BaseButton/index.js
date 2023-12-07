import React from 'react'
import classNames from 'classnames'
import { Button as AntButton } from 'antd'

import './style.scss'

const BaseButton = ({ children, loading, disabled, className, onClick, ...props }) => {
  return (
    <AntButton
      {...props}
      loading={loading}
      disabled={disabled}
      className={classNames('base-btn', className)}
      onClick={onClick}
    >
      {children}
    </AntButton>
  )
}

export default BaseButton
