import React from 'react'
import { Radio } from 'antd'

import './style.scss'

function CustomRadio({ className, disabled, value, checked, onChange, children }) {
  return (
    <Radio
      className={`custom-radio ${className ? className : ''}`}
      value={value}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    >
      {children}
    </Radio>
  )
}

export default CustomRadio
