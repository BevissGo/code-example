import React from 'react'

import arrowDown from 'assets/images/icons/angle-arrow-down.svg'

import './style.scss'

const Test = ({ onOpenDropdown, openDropdownTest, active, children }) => {
  return (
    <div className={`test${openDropdownTest ? ' opened' : ''} ${active ? 'active' : ''}`}>
      <p onClick={onOpenDropdown}>
        Bài Test
        <img src={arrowDown} alt='' />
      </p>
      {children}
    </div>
  )
}

export default Test
