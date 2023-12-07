import React, { useState } from 'react'

import { Select } from 'antd'

import DownArrow from 'assets/images/icons/down-arrow.png'

import './style.scss'

const CustomSelect = ({ value = '', options = [], placeholder = 'Select', onChange, size = 'medium', style }) => {
  const [isDropDownOpen, setDropDownOpen] = useState(false)

  return (
    <Select
      className='custom-select'
      popupClassName='custom-popup'
      value={value}
      size={size}
      style={style}
      placeholder={placeholder}
      onChange={onChange}
      options={options}
      suffixIcon={
        <img
          className={`down-arrow ${isDropDownOpen ? 'rotate' : 'rotate-backward'}`}
          src={DownArrow}
          alt='down arrow icon'
        />
      }
      onDropdownVisibleChange={() => setDropDownOpen(!isDropDownOpen)}
    />
  )
}

export default CustomSelect
