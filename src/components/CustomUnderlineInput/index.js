import React from 'react'
import { Input } from 'antd'

import './style.scss'

function CustomUnderlineInput(props) {
  return (
    <Input
      className='custom-underline-input'
      style={{ padding: 0 }}
      placeholder={props.placeholder ?? 'Please fill in...'}
      {...props}
    />
  )
}

export default CustomUnderlineInput
