import React from 'react'
import classNames from 'classnames'

import './style.scss'
import BaseButton from '../BaseButton'

const PrimaryButton = ({ children, loading, disabled, className, onClick, ...props }) => {
  return (
    <BaseButton
      {...props}
      type='primary'
      loading={loading}
      disabled={disabled}
      className={classNames('primary-btn', className)}
      onClick={onClick}
    >
      {children}
    </BaseButton>
  )
}

export default PrimaryButton
