import React from 'react'
import './style.scss'

const LabelClickableInputRadio = ({ id, name, label, value, disabled, defaultChecked, onChange, isBottom = false }) => {
  return (
    <div className='label-clickable-input-radio' style={{ marginBottom: isBottom ? 12 : 0 }}>
      <input
        type='radio'
        name={name}
        value={value}
        id={name + id}
        disabled={disabled}
        defaultChecked={defaultChecked}
        onChange={onChange}
      />
      <span className='label-clickable-input-radio__checkmark' />
      <label htmlFor={name + id} className='label-clickable-input-radio__label'>
        {label}
      </label>
    </div>
  )
}

export default LabelClickableInputRadio
