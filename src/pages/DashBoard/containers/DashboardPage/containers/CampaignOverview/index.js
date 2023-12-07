import React, { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Pie, Column } from '@ant-design/plots'
import { Empty, Spin } from 'antd'
import { round } from 'lodash'
import dayjs from 'dayjs'

import { getAllCandidates } from 'api/business/userPositionCampaign.api'
import { fetchCampaignList } from 'api/business/campaign.api'

import {
  calcRateOfCampaignStatus,
  convertFromCandidatesToCandidatesFilteredWithStatus,
  formatTimeToFilter,
} from '../../helper'
import ChartWrapper from '../../components/ChartWrapper'
import Section from '../../components/Section'

import './style.scss'

function CampaignOverview() {
  const [candidates, setCandidates] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [campaignsIncludeCancelled, setCampaignsIncludeCancelled] = useState([])
  const [campaignOptions, setCampaignOptions] = useState([])
  const [candidatesFilteredWithStatus, setCandidatesFilteredWithStatus] = useState([])
  const [campaignsByStatus, setCampaignsByStatus] = useState()
  const [firstDay, setFirstDay] = useState(dayjs().subtract(30, 'days'))
  const [lastDay, setLastDay] = useState(dayjs())

  const { mutate: getAllCandidatesMutate, isLoading: getAllCandidatesLoading } = useMutation(
    () =>
      getAllCandidates({
        firstDay: formatTimeToFilter(firstDay),
        lastDay: formatTimeToFilter(lastDay.add(1, 'day')),
      }),
    {
      onSuccess: (data) => {
        setCandidates(data?.filter((e) => !e.user.campaignId.cancelled)?.map((e) => e.user))
      },
    },
  )

  const { mutate: getCampaignQuantityMutate, isLoading: getCampaignQuantityLoading } = useMutation(
    () =>
      fetchCampaignList({
        startDateDuration: formatTimeToFilter(firstDay),
        endDateDuration: formatTimeToFilter(lastDay.add(1, 'day')),
      }),
    {
      onSuccess: (data) => {
        setCampaignsIncludeCancelled(data)
        setCampaigns(data.filter((e) => !e.cancelled))
      },
    },
  )

  useEffect(() => {
    getAllCandidatesMutate()
    getCampaignQuantityMutate()
  }, [getAllCandidatesMutate, getCampaignQuantityMutate, firstDay, lastDay])

  useEffect(() => {
    let candidatesFilteredWithStatusData = []
    const candidatesFilteredWithCampaignsData = []
    const options = []

    for (const campaign of campaigns) {
      candidatesFilteredWithCampaignsData.push({
        name: campaign.campaignName,
        numberOfCandidates: candidates?.filter((e) => e.campaignId?.Id === campaign.Id)?.length,
      })

      options.push({
        value: campaign.Id,
        label: campaign.campaignName,
        numberOfCandidates: candidates?.filter((e) => e.campaignId?.Id === campaign.Id)?.length,
      })
    }

    candidatesFilteredWithStatusData = convertFromCandidatesToCandidatesFilteredWithStatus(campaigns, candidates)

    setCampaignOptions(options)
    setCandidatesFilteredWithStatus(candidatesFilteredWithStatusData)
    setCampaignsByStatus(calcRateOfCampaignStatus(campaignsIncludeCancelled))
  }, [campaigns, campaignsIncludeCancelled, candidates])

  const handleSelectCampaigns = (values) => {
    const filteredCampaigns = []
    let candidatesFilteredWithStatusData = []
    const candidatesFilteredWithCampaignsData = []

    if (!values.length) {
      for (const campaign of campaigns) {
        candidatesFilteredWithCampaignsData.push({
          name: campaign.campaignName,
          numberOfCandidates: candidates?.filter((e) => e.campaignId?.Id === campaign.Id)?.length,
        })
      }

      candidatesFilteredWithStatusData = convertFromCandidatesToCandidatesFilteredWithStatus(campaigns, candidates)

      setCampaignsByStatus(calcRateOfCampaignStatus(campaignsIncludeCancelled))
    } else {
      for (const value of values) {
        const found = campaigns?.find((e) => e.Id === value.value)

        if (found) {
          filteredCampaigns.push(found)
        }
      }

      for (const campaign of filteredCampaigns) {
        candidatesFilteredWithCampaignsData.push({
          name: campaign.campaignName,
          numberOfCandidates: candidates?.filter((e) => e.campaignId?.Id === campaign.Id)?.length,
        })
      }

      candidatesFilteredWithStatusData = convertFromCandidatesToCandidatesFilteredWithStatus(
        filteredCampaigns,
        candidates,
      )

      setCampaignsByStatus(calcRateOfCampaignStatus(filteredCampaigns))
    }

    setCandidatesFilteredWithStatus(candidatesFilteredWithStatusData)
  }

  const handleChangeDate = (date) => {
    setFirstDay(date[0])
    setLastDay(date[1])
  }

  const handleResetDateRange = () => {
    setFirstDay(dayjs().subtract(30, 'days'))
    setLastDay(dayjs())
  }

  return (
    <Spin spinning={getAllCandidatesLoading || getCampaignQuantityLoading}>
      <Section
        title='Campaign Overview'
        firstDay={firstDay}
        lastDay={lastDay}
        campaignOptions={campaignOptions}
        hasPosition={false}
        hasFilterYear={false}
        handleSelectCampaigns={handleSelectCampaigns}
        handleChangeDate={handleChangeDate}
        handleResetDateRange={handleResetDateRange}
      >
        <div className='campaign-overview'>
          <div className='campaign-overview__section1'>
            <ChartWrapper title='Total number of candidates in each campaign'>
              {!candidatesFilteredWithStatus?.length ? (
                <Empty description='No campaigns' />
              ) : (
                <Column
                  style={{ width: '100%' }}
                  data={candidatesFilteredWithStatus}
                  isStack={true}
                  xField='name'
                  yField='numberOfCandidates'
                  seriesField='type'
                  color={['#71B8FF', '#66EF88', '#FFDF75', '#FFA7A7']}
                  columnStyle={{
                    radius: [4, 4, 0, 0],
                  }}
                  xAxis={{
                    label: {
                      style: {
                        fontFamily: 'Montserrat-Regular',
                        fill: '#000',
                      },
                    },
                  }}
                  yAxis={{
                    grid: {
                      line: {
                        style: {
                          stroke: '#dfdfdf',
                          lineDash: [8, 6],
                        },
                      },
                    },
                  }}
                  appendPadding={[52, 0, 0, 0]}
                  legend={{
                    position: 'top',
                    reversed: true,
                    itemName: {
                      style: {
                        fontFamily: 'Montserrat-Bold',
                        fontSize: 12,
                        fill: '#000',
                      },
                    },
                  }}
                  tooltip={{
                    reversed: true,
                    showTitle: false,
                  }}
                />
              )}
            </ChartWrapper>
          </div>
          <div className='campaign-overview__section2'>
            {!campaigns?.length ? (
              <Empty description='No campaigns' />
            ) : (
              <Pie
                style={{ width: '100%' }}
                data={campaignsByStatus}
                angleField='value'
                colorField='status'
                color={['#B32A2A', '#FFA7A7', '#FFD2D2', '#FFECEC']}
                radius={1}
                innerRadius={0.6}
                label={false}
                legend={false}
                tooltip={{
                  formatter: ({ status, value }) => {
                    return { name: status, value: round((value / campaignsIncludeCancelled?.length) * 100, 1) + '%' }
                  },
                }}
                statistic={{
                  title: {
                    offsetY: -4,
                    style: {
                      fontFamily: 'Montserrat-Regular',
                      fontSize: '14px',
                    },
                    content: 'Campaigns By',
                  },
                  content: {
                    offsetY: 4,
                    style: {
                      fontFamily: 'Montserrat-Bold',
                      fontSize: '16px',
                    },
                    content: 'STATUS',
                  },
                }}
                interactions={[
                  {
                    type: 'element-active',
                  },
                ]}
              />
            )}
          </div>
        </div>
      </Section>
    </Spin>
  )
}

export default CampaignOverview
