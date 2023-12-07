import React from 'react'
import dayjs from 'dayjs'
import { DatePicker } from 'antd'

import './style.scss'

const { RangePicker } = DatePicker

const CustomDatePicker = ({ setDateRange }) => {

  const rangePresets = [
    { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
  ]

  const formatUtcToStartOfDate = (date) => {
    const currentUtcDate = new Date(date).toISOString()
    const startDate = new Date(currentUtcDate)
    startDate.setUTCHours(0, 0, 0, 0)
    return startDate.toISOString()
  }

  const handleChangeDate = (date = []) => {
    if (date) {
      setDateRange([formatUtcToStartOfDate(date[0]), formatUtcToStartOfDate(date[1])])
    } else {
      setDateRange([])
    }
  }

  return (
    <RangePicker 
      presets={rangePresets} 
      onChange={handleChangeDate}
      className='custom-datepicker'
      placeholder={['From', 'To']}
    />
  )
}

export default CustomDatePicker