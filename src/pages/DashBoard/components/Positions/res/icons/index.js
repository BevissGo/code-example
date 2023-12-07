import React  from 'react'
export const IconMoreThreeDot = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
      d='M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z' 
        stroke='#454545' 
        strokeWidth='2' 
        strokeLinecap='round' 
        strokeLinejoin='round'
      />
      <path
        d='M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z' 
        stroke='#454545' 
        strokeWidth='2' 
        strokeLinecap='round' 
        strokeLinejoin='round'
      />
      <path 
      d='M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z' 
        stroke='#454545' 
        strokeWidth='2' 
        strokeLinecap='round' 
        strokeLinejoin='round'
      />
  </svg>
)

export const DownArrow = ({ isRotage}) => (
  <svg  width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M11 1L6 6L1 1' stroke='#454545' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
    {isRotage ? <animateTransform attributeType='xml' attributeName='transform' type='rotate' from={'0'} to={'180'} dur='0.5s' additive='sum' /> : 
    <animateTransform attributeType='xml' attributeName='transform' type='rotate' from={'180'} to={'0'} dur='0.5s' additive='sum' />}
  </svg>
)

export const LeftArrow = () => (
  <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M18.75 22.5L11.25 15L18.75 7.5' stroke='#454545' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
  </svg>
)



export const Search = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z' stroke='#C4C4C4' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
    <path d='M15 15L12 12' stroke='#C4C4C4' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
  </svg>
)
