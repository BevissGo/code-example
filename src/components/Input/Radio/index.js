import React from 'react'

import './style.scss'

const InputRadio = ({
  name,
  label,
  value,
  disabled,
  defaultChecked,
  onChange,
}) => {
  return (
    <div className='input-radio'>
      <input
        id={name}
        name={name}
        type='radio'
        value={value}
        disabled={disabled}
        defaultChecked={defaultChecked}
        onChange={onChange}
      />
      <span className='input-radio__checkmark'></span>
      <span className='input-radio__label'>{label}</span>
    </div>
  )
}

export default InputRadio
