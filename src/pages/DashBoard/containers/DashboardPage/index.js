import React, { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'

import ButtonAntd from 'components/Button/Antd'
import CustomSelect from 'components/CustomSelect'
import TutorialTour from 'containers/Tour/Tutorial'
import { toastifyNotify } from 'helpers'
import { fetchCampaignList } from 'api/business/campaign.api'

import DashboardBar from '../DashboardBar'

import OnboardedCandidatesHeader from './containers/OnboardedCandidatesHeader'
import TestResultsOverview from './containers/TestResultsOverview'
import CandidatesOverview from './containers/CandidatesOverview'
import CandidatesHeader from './containers/CandidatesHeader'
import CampaignOverview from './containers/CampaignOverview'
import CampaignsHeader from './containers/CampaignsHeader'
import { formatTimeToFilter, getCampaignDuration } from './helper'

import './style.scss'

const { RangePicker } = DatePicker

function DashboardPage({ positionRef }) {
  const timeOptions = [
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'allTime', label: 'All Time' },
    { value: 'custom', label: 'Custom Time' },
  ]

  const steps = [
    {
      title: 'Hello',
      description:
        'Welcome to DiSC for enterprise. This tutorial for beginner helps you to experience this platform in the most effective way',
      mask: { style: { pointerEvents: 'auto' } },
      target: null,
    },
    {
      title: 'Dashboard',
      description:
        'This is our Dashboard where you can view all data related to your campaigns, candidates, positions and tests',
      mask: { style: { pointerEvents: 'auto' } },
      target: () => dashboardRef.current,
    },
    {
      title: 'Position',
      description: (
        <p>
          First, you have to add all recruiting positions of your company.
          <br />
          <b>Let&apos;s try clicking this tab!</b>
        </p>
      ),
      placement: 'right',
      nextButtonProps: { style: { display: 'none' } },
      target: () => positionRef.current,
    },
  ]

  const thisWeekFirstDay = formatTimeToFilter(dayjs().weekday(1))
  const thisWeekLastDay = formatTimeToFilter(dayjs().weekday(8))

  const lastWeekLastDay = thisWeekFirstDay
  const lastWeekFirstDay = formatTimeToFilter(dayjs().weekday(-6))

  const thisMonthFirstDay = formatTimeToFilter(dayjs().startOf('month'))
  const thisMonthLastDay = formatTimeToFilter(dayjs().endOf('month').add(1, 'day'))

  const lastMonthFirstDay = formatTimeToFilter(dayjs().subtract(1, 'month').startOf('month'))
  const lastMonthLastDay = formatTimeToFilter(dayjs().subtract(1, 'month').endOf('month').add(1, 'day'))

  const [timeOption, setTimeOption] = useState('thisWeek')
  const [customFirstDay, setCustomFirstDay] = useState(dayjs().subtract(30, 'days'))
  const [customLastDay, setCustomLastDay] = useState(dayjs())
  const [hideRangePicker, setHideRangePicker] = useState(true)
  const [extendedList, setExtendedList] = useState([true, false, false])

  const dashboardRef = useRef(null)

  const { startDateDuration, endDateDuration } = getCampaignDuration(
    false,
    timeOption,
    customFirstDay,
    customLastDay,
    thisWeekFirstDay,
    thisWeekLastDay,
    thisMonthFirstDay,
    thisMonthLastDay,
  )

  const { data: campaigns, isFetching: getCampaignsLoading } = useQuery(
    ['campaigns', startDateDuration, endDateDuration],
    () => fetchCampaignList({ startDateDuration, endDateDuration }),
    {
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to fetch campaign list.')
      },
      select: (data) => data.filter((e) => !e.cancelled),
      initialData: [],
    },
  )

  const handleChangeTime = (value) => {
    setTimeOption(value)

    if (value === 'custom') {
      setHideRangePicker(false)
    } else {
      setHideRangePicker(true)
    }

    if (value === 'allTime') {
      setExtendedList([false, false, false])
    }
  }

  const handleChangeDate = (date) => {
    setCustomFirstDay(date[0])
    setCustomLastDay(date[1])
  }

  const handleResetDateRange = () => {
    setCustomFirstDay(dayjs().subtract(30, 'days'))
    setCustomLastDay(dayjs())
  }

  const handleExtendCandidatesHeader = () => setExtendedList([!extendedList[0], false, false])
  const handleExtendCampaignsHeader = () => setExtendedList([false, !extendedList[1], false])
  const handleExtendOnboardedCandidatesHeader = () => setExtendedList([false, false, !extendedList[2]])

  return (
    <div className='dashboard-page'>
      <div ref={dashboardRef}>
        <DashboardBar title='Dashboard' />
        <div className='dashboard-page__select-time'>
          <CustomSelect
            value={timeOption}
            options={timeOptions}
            placeholder='Select position'
            onChange={handleChangeTime}
            size='large'
          />
          <div hidden={hideRangePicker}>
            <RangePicker
              value={[customFirstDay, customLastDay]}
              style={{ width: 240, marginLeft: 8 }}
              allowClear={false}
              renderExtraFooter={() => (
                <div className='section__footer-range-picker'>
                  <ButtonAntd title='Reset' onButtonClick={handleResetDateRange} />
                </div>
              )}
              onChange={handleChangeDate}
            />
          </div>
        </div>
        <div className='dashboard-page__header'>
          <CandidatesHeader
            timeOption={timeOption}
            lastWeekFirstDay={lastWeekFirstDay}
            lastWeekLastDay={lastWeekLastDay}
            lastMonthFirstDay={lastMonthFirstDay}
            lastMonthLastDay={lastMonthLastDay}
            customFirstDay={customFirstDay}
            customLastDay={customLastDay}
            handleExtend={handleExtendCandidatesHeader}
            extendedList={extendedList}
            campaigns={campaigns}
            getCampaignsLoading={getCampaignsLoading}
          />
          <CampaignsHeader
            timeOption={timeOption}
            lastWeekFirstDay={lastWeekFirstDay}
            lastWeekLastDay={lastWeekLastDay}
            lastMonthFirstDay={lastMonthFirstDay}
            lastMonthLastDay={lastMonthLastDay}
            customFirstDay={customFirstDay}
            customLastDay={customLastDay}
            handleExtend={handleExtendCampaignsHeader}
            extendedList={extendedList}
            campaigns={campaigns}
            getCampaignsLoading={getCampaignsLoading}
          />
          <OnboardedCandidatesHeader
            timeOption={timeOption}
            lastWeekFirstDay={lastWeekFirstDay}
            lastWeekLastDay={lastWeekLastDay}
            lastMonthFirstDay={lastMonthFirstDay}
            lastMonthLastDay={lastMonthLastDay}
            customFirstDay={customFirstDay}
            customLastDay={customLastDay}
            handleExtend={handleExtendOnboardedCandidatesHeader}
            extendedList={extendedList}
            campaigns={campaigns}
            getCampaignsLoading={getCampaignsLoading}
          />
        </div>
      </div>
      <CampaignOverview />
      <CandidatesOverview />
      <TestResultsOverview />

      <TutorialTour steps={steps} />
    </div>
  )
}

export default DashboardPage
