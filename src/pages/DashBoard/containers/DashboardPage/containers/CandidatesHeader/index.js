import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { getAllCandidates } from 'api/business/userPositionCampaign.api'
import { toastifyNotify } from 'helpers'

import QuantityShow from '../../components/QuantityShow'
import { calcChangeRateWithTimeOption, generateDataForCandidatesChart, getCandidateDuration } from '../../helper'

function CandidatesHeader({
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

  const { data: candidates, isFetching: getAllCandidatesLoading } = useQuery(
    ['candidates', firstDay, lastDay],
    () => getAllCandidates({ firstDay, lastDay }),
    {
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to fetch candidates list.')
      },
      select: (data) => data.filter((e) => !e.user.campaignId.cancelled),
      initialData: [],
    },
  )

  const { data: candidatesWithTimeFilter, isFetching: getAllCandidatesWithTimeFilterLoading } = useQuery(
    ['candidates', firstDayWithTimeFilter, lastDayWithTimeFilter],
    () => getAllCandidates({ firstDay: firstDayWithTimeFilter, lastDay: lastDayWithTimeFilter }),
    {
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to fetch candidates list.')
      },
      select: (data) => data.filter((e) => !e.user.campaignId.cancelled),
      initialData: [],
    },
  )

  const dataCandidatesChart = generateDataForCandidatesChart(
    campaigns,
    candidates,
    candidatesWithTimeFilter,
    timeOption,
  )

  return (
    <QuantityShow
      title='Candidates'
      bgColor={'#EBF9EE'}
      xField='campaign'
      yField='totalCandidates'
      seriesField='time'
      extended={extendedList[0]}
      quantity={candidates.length}
      timeOption={timeOption}
      dateDiff={customLastDay.diff(customFirstDay, 'day')}
      dataChart={dataCandidatesChart}
      changeRate={calcChangeRateWithTimeOption(timeOption, candidates, candidatesWithTimeFilter)}
      handleExtend={handleExtend}
      isLoading={getAllCandidatesLoading || getAllCandidatesWithTimeFilterLoading || getCampaignsLoading}
    />
  )
}

export default CandidatesHeader
