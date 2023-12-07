import React from 'react'
import { Radio } from 'antd'

const RadioGroup = ({
  value,
  options,
  onChange,
}) => {
  return (
    <Radio.Group
      value={value}
      options={options}
      optionType='button'
      buttonStyle='solid'
      className='radio-group'
      onChange={onChange}
    />
  )
}

export default RadioGroup
