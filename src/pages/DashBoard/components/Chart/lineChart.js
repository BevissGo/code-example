import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import moment from 'moment'
import dayjs from 'dayjs'

import './style.scss'
import { DatePicker } from 'antd'
import { useDispatch } from 'react-redux'
import { fetchChartCandidate } from 'redux/services/dashboard'

const { RangePicker } = DatePicker

const options = {
  responsive: true,
  layout: {
    padding: {
      top: 40,
      left: 0,
      right: 0,
      bottom: 20,
    },
  },
  legend: {
    display: false,
    position: 'top',
  },
}

const getArrayDate = (start, end) => {
  let result = []
  let dt = new Date(start)
  while (dt <= end) {
    result.push(new Date(dt).setHours(0, 0, 0, 0))
    dt.setDate(dt.getDate() + 1)
  }
  return result
}

const LineChart = ({ dataChart, contentPage }) => {
  const [period, setPeriod] = useState([moment().subtract(7, 'd'), moment()])
  const dispatch = useDispatch()

  const disabledDate = (current) => {
    return current.valueOf() > Date.now()
  }

  useEffect(() => {
    if (period) {
      const timePeriod = { periodStart: period[0]._d.getTime(), periodEnd: period[1]._d.getTime() }
      dispatch(fetchChartCandidate(timePeriod))
    }
  }, [period])

  let arrayDate
  if (period && period[1]) {
    arrayDate = getArrayDate(period[0]._d, period[1]._d)
    arrayDate = arrayDate.map((item) => {
      return { date: item, count: 0 }
    })
    arrayDate = arrayDate.map(
      (item) => dataChart.find((o) => new Date(+o.date).setHours(0, 0, 0, 0) === item.date) || item,
    )
  }

  const labels = arrayDate?.map((item) => {
    return dayjs(+item.date).format('DD/MM')
  })

  const dataValues = arrayDate?.map((item) => item.count)
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total number of candidates 1',
        data: dataValues,
        borderColor: '#E5C47C',
        backgroundColor: 'transparent',
      },
    ],
  }

  const handleOnChangeRangeDate = (e) => {
    setPeriod(e)
  }

  return (
    <div className='line-chart-dashboard'>
      <p className='line-chart-dashboard__title'>{contentPage.totalNumberOfCandidates}</p>
      <p className='line-chart-dashboard__description'>
        <div>{contentPage.showData}:</div>
        {/* <span className='description-type'>{contentPage.thisWeek}</span> */}
        <RangePicker value={period} disabledDate={disabledDate} onChange={handleOnChangeRangeDate} />
      </p>
      <Line options={options} data={data} height={300} />
    </div>
  )
}

export default LineChart
