import React from 'react'

import qNo3H from 'assets/images/iqTest/qNo3/question.png'

import './style.scss'

const InputImageRadio = ({
  name,
  label,
  value,
  imgAlt,
  disabled,
  defaultChecked,
  onChange,
}) => {
  return (
    <div className='input-image-radio'>
      <div>
        <img src={qNo3H} alt={imgAlt} width='100'></img>
      </div>
      <div>
        <input
          type='radio'
          name={name}
          value={value}
          disabled={disabled}
          defaultChecked={defaultChecked}
          onChange={onChange}
        />
        <span className='input-image-radio__checkmark'></span>
        <span className='input-image-radio__label'>{label}</span>
      </div>
    </div>
  )
}

export default InputImageRadio
