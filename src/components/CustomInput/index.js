import React from 'react'
import { Input } from 'antd'

function CustomInput(props) {
  return (
    <Input
      style={{ height: 40, padding: '8px 12px' }}
      placeholder={props.placeholder ?? 'Please fill in...'}
      {...props}
    />
  )
}

export default CustomInput
