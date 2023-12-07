import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { getAllCandidates } from 'api/business/userPositionCampaign.api'
import { toastifyNotify } from 'helpers'

import QuantityShow from '../../components/QuantityShow'
import { calcChangeRateWithTimeOption, generateDataForCandidatesChart, getCandidateDuration } from '../../helper'

function OnboardedCandidatesHeader({
  campaigns,
  timeOption,
  extendedList,
  thisWeekFirstDay,
  thisWeekLastDay,
  thisMonthFirstDay,
  thisMonthLastDay,
  lastWeekFirstDay,
  lastWeekLastDay,
  lastMonthFirstDay,
  lastMonthLastDay,
  customFirstDay,
  customLastDay,
  getCampaignsLoading,
  handleExtend,
}) {
  const { firstDay, lastDay } = getCandidateDuration(
    false,
    timeOption,
    customFirstDay,
    customLastDay,
    thisWeekFirstDay,
    thisWeekLastDay,
    thisMonthFirstDay,
    thisMonthLastDay,
  )

  const { firstDay: firstDayWithTimeFilter, lastDay: lastDayWithTimeFilter } = getCandidateDuration(
    true,
    timeOption,
    customFirstDay,
    customLastDay,
    lastWeekFirstDay,
    lastWeekLastDay,
    lastMonthFirstDay,
    lastMonthLastDay,
  )

  const { data: onboardedCandidates, isFetching: getOnboardedCandidatesLoading } = useQuery(
    ['onboardedCandidates', firstDay, lastDay],
    () => getAllCandidates({ firstDay, lastDay }),
    {
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to fetch onboardedCandidates list.')
      },
      select: (data) => data.filter((e) => e.user.status === 'onboarding'),
      initialData: [],
    },
  )

  const { data: onboardedCandidatesWithTimeFilter, isFetching: getOnboardedCandidatesWithTimeFilterLoading } = useQuery(
    ['onboardedCandidates', firstDayWithTimeFilter, lastDayWithTimeFilter],
    () => getAllCandidates({ firstDay: firstDayWithTimeFilter, lastDay: lastDayWithTimeFilter }),
    {
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to fetch onboardedCandidates list.')
      },
      select: (data) => data.filter((e) => e.user.status === 'onboarding'),
      initialData: [],
    },
  )

  const dataOnboardedCandidatesChart = generateDataForCandidatesChart(
    campaigns,
    onboardedCandidates,
    onboardedCandidatesWithTimeFilter,
    timeOption,
  )

  return (
    <QuantityShow
      title='Onboarded CD'
      bgColor={'#E3F1FF'}
      xField='campaign'
      yField='totalCandidates'
      seriesField='time'
      extended={extendedList[2]}
      quantity={onboardedCandidates.length}
      timeOption={timeOption}
      dateDiff={customLastDay.diff(customFirstDay, 'day')}
      dataChart={dataOnboardedCandidatesChart}
      changeRate={calcChangeRateWithTimeOption(timeOption, onboardedCandidates, onboardedCandidatesWithTimeFilter)}
      handleExtend={handleExtend}
      isLoading={getOnboardedCandidatesWithTimeFilterLoading || getOnboardedCandidatesLoading || getCampaignsLoading}
    />
  )
}

export default OnboardedCandidatesHeader
