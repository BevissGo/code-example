import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { updateListAnswer } from 'redux/actions/IQTest'

import './style.scss'

const InputImageRadio = ({
  name,
  label,
  value,
  imgSrc,
  imgAlt,
  disabled,
  defaultChecked,
  indexGroupQuestion,
}) => {
  const dispatch = useDispatch()

  const onChangeRadio = useCallback(
    () => dispatch(updateListAnswer(indexGroupQuestion, value)),
    [indexGroupQuestion, value, dispatch]
  )
  return (
    <div className='input-image-radio'>
      <div>
        <label htmlFor={imgAlt}>
          <img src={imgSrc} alt={imgAlt} width='80'></img>
        </label>
      </div>
      <div>
        <input
          id={imgAlt}
          name={name}
          type='radio'
          value={value}
          disabled={disabled}
          defaultChecked={defaultChecked}
          onChange={onChangeRadio}
        />
        <span className='input-image-radio__checkmark'></span>
        <span className='input-image-radio__label'>
          <label htmlFor={imgAlt}>{label}</label>
        </span>
      </div>
    </div>
  )
}

export default InputImageRadio
