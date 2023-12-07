import moment from 'moment'
import { Button, DatePicker } from 'antd'
import React, { useState } from 'react'

import { ReactComponent as IconLeftArrow } from 'assets/images/dashboard/left-arrow.svg'
import { ReactComponent as IconRightArrow } from 'assets/images/dashboard/right-arrow.svg'

import './style.scss'

const { RangePicker } = DatePicker
const DEFAULT_PICKER_DATE_RANGE = 7

const WeekdayFilter = () => {
  const [date, setDate] = useState(moment().day(1))
  const [currentDistance, setCurrentDistance] = useState(DEFAULT_PICKER_DATE_RANGE)

  const onClickLeft = () => {
    setDate((curr) => moment(curr).subtract(currentDistance + 1, 'days'))
  }

  const onClickRight = () => {
    setDate((curr) => moment(curr).add(currentDistance + 1, 'days'))
  }

  const handleDayRangeChange = ([from, to]) => {
    setDate(from)
    setCurrentDistance(Math.abs(from.diff(to, 'days')))
  }

  return (
    <div className='weekday-filter__container'>
      <div className='weekday-filter'>
        <Button type='text' className='weekday-filter__switch-date-range-btn' onClick={onClickLeft}>
          <IconLeftArrow />
        </Button>
        <RangePicker
          bordered={false}
          className='weekday-filter__range-calendar'
          defaultValue={[date, moment(date).add(currentDistance, 'days')]}
          value={[date, moment(date).add(currentDistance, 'days')]}
          separator='-'
          format='DD/MM/YYYY'
          suffixIcon={null}
          allowClear={false}
          popupStyle={{
            fontFamily: 'ProximaNova-Regular',
          }}
          onChange={handleDayRangeChange}
        />
        <Button type='text' className='weekday-filter__switch-date-range-btn' onClick={onClickRight}>
          <IconRightArrow />
        </Button>
      </div>
    </div>
  )
}

export default WeekdayFilter
