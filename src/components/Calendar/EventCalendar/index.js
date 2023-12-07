import React, { useState } from 'react'
import moment from 'moment'
import { Calendar, Badge } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

import './style.scss'

const EventCalendar = () => {
  const [date, setDate] = useState(moment())

  const handleChange = (newDate) => {
    setDate(newDate)
  }

  const handlePrevMonth = () => {
    setDate(moment(date).subtract(1, 'months'))
  }

  const handleNextMonth = () => {
    setDate(moment(date).add(1, 'months'))
  }

  const events = [1, 7, 15, 27]
  const dateCellRender = (value) => {
    const day = value.date()
    let hasEvent = false
    if (events.indexOf(day) > -1) {
      hasEvent = true
    }
    return (
      <div className='date-cell__container'>
        <div className='date-cell'>
          <div className='date-cell__day'>{day}</div>
          <div className='date-cell__event'>
            {hasEvent && <Badge status='warning' />}
          </div>
        </div>
      </div>
    )
  }

  const renderHeader = ({ value }) => {
    return (
      <div className='calendar-header__container'>
        <div className='calendar-header'>
          <div className='calendar-header__navigator'>
            <LeftOutlined onClick={handlePrevMonth} />
          </div>
          <div className='calendar-header__title'>{value.format('MMMM YYYY')}</div>
          <div className='calendar-header__navigator'>
            <RightOutlined onClick={handleNextMonth} />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='event-calendar__wrapper'>
      <div className='event-calendar__container'>
        <Calendar value={date} fullscreen={false} dateFullCellRender={dateCellRender} headerRender={renderHeader} onChange={handleChange} />
      </div>
    </div>
  )
}

export default EventCalendar