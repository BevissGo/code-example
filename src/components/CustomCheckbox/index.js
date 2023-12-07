import React from 'react'
import { Checkbox } from 'antd'

import './style.scss'

function CustomCheckbox({ name, value, checked, disabled, children }) {
  return (
    <Checkbox
      className={checked ? 'custom-checkbox--checked' : 'custom-checkbox'}
      name={name}
      value={value}
      size='large'
      checked={checked}
      disabled={disabled}
    >
      {children}
    </Checkbox>
  )
}

export default CustomCheckbox
