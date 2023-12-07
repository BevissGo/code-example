import React from 'react'
import Select, { components } from 'react-select'

import checkBox from 'assets/images/icons/check-box.png'
import checkBoxTick from 'assets/images/icons/check-box-tick.png'

import './style.scss'

const CustomOption = ({ innerProps, innerRef, children, isSelected }) => {
  return (
    <div className='custom-option' ref={innerRef} {...innerProps}>
      <img className='checkbox-icon' src={isSelected ? checkBoxTick : checkBox} alt='checkbox icon' />
      {children}
    </div>
  )
}

const CustomValueContainer = ({ children, ...props }) => {
  let [values, input] = children
  const maxToShow = 3

  if (Array.isArray(values)) {
    if (values.length > maxToShow) {
      values = `Number of items: ${values.length}`
    } else {
      values = values.map((item) => item.props.children).join(' - ')
    }
  }

  return (
    <components.ValueContainer {...props}>
      {values}
      {input}
    </components.ValueContainer>
  )
}

export default function CustomMultipleSelect({ placeholder, options = [], onChange }) {
  return (
    <Select
      className='custom-select'
      isMulti
      isSearchable
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      isClearable={false}
      placeholder={placeholder}
      styles={{
        control: (base) => ({
          ...base,
          cursor: 'pointer',
          borderRadius: 30,
          height: '100%',
          ':hover': {
            borderColor: '#6bb5ff',
          },
        }),
        multiValueRemove: (base) => ({
          ...base,
          display: 'none',
        }),
      }}
      components={{
        Option: CustomOption,
        ValueContainer: CustomValueContainer,
      }}
      onChange={onChange}
      options={options}
    />
  )
}
