import React from 'react'

import './style.scss'

const SelectDefault = ({ name, data, value, groupName, onChange }) => {
  return (
    <div className={`select-default${value ? ' selected' : ''}`}>
      <span className='angle-down'>&#8249;</span>
      <select name={name} onChange={onChange} data-groupname={groupName}>
        {data.map((element) => (
          <option key={element.id} value={element.value}>
            {element.text}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectDefault
