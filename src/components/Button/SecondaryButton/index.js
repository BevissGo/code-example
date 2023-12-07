import React from 'react'
import classNames from 'classnames'

import './style.scss'
import BaseButton from '../BaseButton'

const SecondaryButton = ({ children, loading, disabled, className, onClick, ...props }) => {
  return (
    <BaseButton
      {...props}
      type='secondary'
      loading={loading}
      disabled={disabled}
      className={classNames('secondary-btn', className)}
      onClick={onClick}
    >
      {children}
    </BaseButton>
  )
}

export default SecondaryButton
