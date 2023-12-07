import './style.scss'
import React from 'react'
import { DatePicker } from 'antd'

const DatePicketAntd = (props) => {
  return <DatePicker className='date-picker-antd' format='DD/MM/YYYY' {...props} />
}

export default DatePicketAntd
