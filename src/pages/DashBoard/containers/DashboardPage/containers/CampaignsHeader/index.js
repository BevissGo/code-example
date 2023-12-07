import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { fetchCampaignList } from 'api/business/campaign.api'
import { toastifyNotify } from 'helpers'

import QuantityShow from '../../components/QuantityShow'
import { calcChangeRateWithTimeOption, generateDataForCampaignsChart, getCampaignDuration } from '../../helper'

function CampaignsHeader({
  timeOption,
  lastWeekFirstDay,
  lastWeekLastDay,
  lastMonthFirstDay,
  lastMonthLastDay,
  customFirstDay,
  customLastDay,
  extendedList,
  campaigns,
  getCampaignsLoading,
  handleExtend,
}) {
  const { startDateDuration: startDateDurationWithTimeFilter, endDateDuration: endDateDurationWithTimeFilter } =
    getCampaignDuration(
      true,
      timeOption,
      customFirstDay,
      customLastDay,
      lastWeekFirstDay,
      lastWeekLastDay,
      lastMonthFirstDay,
      lastMonthLastDay,
    )

  const { data: campaignsWithTimeFilter, isFetching: getCampaignsWithTimeFilterLoading } = useQuery(
    ['campaigns', startDateDurationWithTimeFilter, endDateDurationWithTimeFilter],
    () =>
      fetchCampaignList({
        startDateDuration: startDateDurationWithTimeFilter,
        endDateDuration: endDateDurationWithTimeFilter,
      }),
    {
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to fetch campaign list.')
      },
      select: (data) => data.filter((e) => !e.cancelled),
      initialData: [],
    },
  )

  const dataCampaignsChart = generateDataForCampaignsChart(campaignsWithTimeFilter, campaigns, timeOption)

  return (
    <QuantityShow
      title='Campaigns'
      bgColor={'#FFECEC'}
      xField='type'
      yField='totalCampaigns'
      seriesField='time'
      extended={extendedList[1]}
      quantity={campaigns.length}
      timeOption={timeOption}
      dateDiff={customLastDay.diff(customFirstDay, 'day')}
      dataChart={dataCampaignsChart}
      changeRate={calcChangeRateWithTimeOption(timeOption, campaigns, campaignsWithTimeFilter)}
      handleExtend={handleExtend}
      isLoading={getCampaignsWithTimeFilterLoading || getCampaignsLoading}
    />
  )
}

export default CampaignsHeader
