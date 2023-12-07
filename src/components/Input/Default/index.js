import React, { useCallback } from 'react'

import { symbolSeparating } from 'utils'

import './style.scss'

const InputDefault = ({
  type,
  name,
  value,
  groupName,
  maxLength,
  uppercase,
  cardNumber,
  placeholder,
  onChange,
}) => {
  const handleShowValue = useCallback(
    (value) => {
      if (cardNumber) {
        return symbolSeparating(value, 4, ' ')
      }
      if (uppercase) {
        return value.toUpperCase()
      }
      return value
    },
    [cardNumber, uppercase]
  )

  return (
    <div className='input-default'>
      <input
        type={type}
        name={name}
        maxLength={maxLength}
        placeholder={placeholder}
        data-groupname={groupName}
        value={handleShowValue(value)}
        onChange={onChange}
      />
    </div>
  )
}

export default InputDefault
