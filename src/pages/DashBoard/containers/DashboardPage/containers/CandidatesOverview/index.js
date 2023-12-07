import { Empty, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Pie, Line } from '@ant-design/plots'
import { round } from 'lodash'

import { getAllCandidates } from 'api/business/userPositionCampaign.api'
import { fetchCampaignList } from 'api/business/campaign.api'
import { getAllPositions } from 'api/business/position.api'

import Section from '../../components/Section'
import ChartWrapper from '../../components/ChartWrapper'
import { calcRateOfCandidateStatus, convertFromCandidatesToOnboardAndRejectOvertime } from '../../helper'

import './style.scss'

function CandidatesOverview() {
  const [candidates, setCandidates] = useState([])
  const [filteredCandidates, setFilteredCandidates] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [selectedCampaigns, setSelectedCampaigns] = useState([])
  const [positions, setPositions] = useState([])
  const [selectedPositions, setSelectedPositions] = useState([])
  const [candidatesWithStatus, setCandidatesWithStatus] = useState([])
  const [onboardingAndRejected, setOnboardingAndRejected] = useState()
  const [selectedYear, setSelectedYear] = useState('alltime')

  const { mutate: getAllCandidatesMutate, isLoading: getAllCandidatesLoading } = useMutation(() => getAllCandidates(), {
    onSuccess: (data) => {
      setCandidates(data?.filter((e) => !e.user.campaignId.cancelled)?.map((e) => e.user))
    },
  })

  const { mutate: getCampaignsMutate, isLoading: getCampaignsLoading } = useMutation(() => fetchCampaignList(), {
    onSuccess: (data) => {
      setCampaigns(
        data
          ?.filter((campaign) => !campaign.cancelled)
          ?.map((campaign) => ({
            value: campaign.Id,
            label: campaign.campaignName,
          })),
      )
    },
  })

  const { mutate: getPostitionsMutate, isLoading: getPostitionsLoading } = useMutation(() => getAllPositions(), {
    onSuccess: (data) => {
      setPositions(
        data?.map((position) => ({
          value: position.Id,
          label: position.name,
        })),
      )
    },
  })

  useEffect(() => {
    getAllCandidatesMutate()
    getCampaignsMutate()
    getPostitionsMutate()
  }, [getAllCandidatesMutate, getCampaignsMutate, getPostitionsMutate])

  useEffect(() => {
    if (selectedCampaigns.length && selectedPositions.length) {
      setFilteredCandidates(
        candidates?.filter(
          (candidate) =>
            selectedCampaigns.includes(candidate.campaignId.Id) && selectedPositions.includes(candidate.positionId.Id),
        ),
      )
    } else if (selectedCampaigns.length && !selectedPositions.length) {
      setFilteredCandidates(candidates?.filter((candidate) => selectedCampaigns.includes(candidate.campaignId.Id)))
    } else if (!selectedCampaigns.length && selectedPositions.length) {
      setFilteredCandidates(candidates?.filter((candidate) => selectedPositions.includes(candidate.positionId.Id)))
    } else {
      setFilteredCandidates(candidates)
    }
  }, [candidates, selectedCampaigns, selectedPositions])

  useEffect(() => {
    setCandidatesWithStatus(calcRateOfCandidateStatus(filteredCandidates, selectedYear).result)
    setOnboardingAndRejected(convertFromCandidatesToOnboardAndRejectOvertime(filteredCandidates, selectedYear))
  }, [filteredCandidates, selectedYear])

  const handleSelectCampaigns = (values) => {
    setSelectedCampaigns(values.map(({ value }) => value))
  }

  const handleSelectPositions = (values) => {
    setSelectedPositions(values.map(({ value }) => value))
  }

  const handleSelectYear = (value) => {
    setSelectedYear(value)
  }

  return (
    <Spin spinning={getAllCandidatesLoading || getCampaignsLoading || getPostitionsLoading}>
      <Section
        title='Candidate Overview'
        campaignOptions={campaigns}
        positionOptions={positions}
        yearOptions={onboardingAndRejected?.yearList}
        selectedYear={selectedYear}
        handleSelectCampaigns={handleSelectCampaigns}
        handleSelectPositions={handleSelectPositions}
        handleSelectYear={handleSelectYear}
        hasDatePicker={false}
      >
        <div className='candidates-overview'>
          <div className='candidates-overview__section1'>
            <ChartWrapper title='Onboarding and Rejected candidates over time'>
              {!candidates?.length ? (
                <Empty description='No candidates' />
              ) : (
                <Line
                  style={{ width: '100%' }}
                  data={onboardingAndRejected?.data}
                  xField='date'
                  yField='quantity'
                  seriesField='type'
                  color={['#3B813A', '#6BB5FF', '#FFA7A7']}
                  smooth={true}
                  tooltip={{
                    showCrosshairs: true,
                    showTitle: false,
                    crosshairs: {
                      type: 'xy',
                      line: {
                        style: {
                          stroke: '#ECCA5B',
                          lineDash: [8, 6],
                          lineWidth: 2,
                        },
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
                    tickCount: 8,
                  }}
                  legend={{
                    position: 'top',
                    itemName: {
                      style: {
                        fontFamily: 'Montserrat-Bold',
                      },
                    },
                    custom: true,
                    items: [
                      {
                        name: 'Total',
                        id: 'Total',
                        value: 'type',
                        marker: { symbol: 'circle', style: { fill: '#3B813A' } },
                      },
                      {
                        name: 'Onboarding',
                        id: 'Onboarding',
                        value: 'type',
                        marker: { symbol: 'circle', style: { fill: '#6BB5FF' } },
                      },
                      {
                        name: 'Rejected',
                        id: 'Rejected',
                        value: 'type',
                        marker: { symbol: 'circle', style: { fill: '#FFA7A7' } },
                      },
                    ],
                  }}
                  meta={{
                    date: {
                      range: [0.05, 1],
                    },
                  }}
                  animation={{
                    appear: {
                      animation: 'path-in',
                      duration: 3000,
                    },
                  }}
                />
              )}
            </ChartWrapper>
          </div>
          <div className='candidates-overview__section2'>
            {!candidates?.length ? (
              <Empty description='No candidates' />
            ) : (
              <Pie
                style={{ width: '100%' }}
                data={candidatesWithStatus}
                angleField='value'
                colorField='status'
                color={['#3B813A', '#66EF88', '#B6FFC8', '#EBF9EE']}
                radius={1}
                innerRadius={0.6}
                label={false}
                legend={false}
                tooltip={{
                  formatter: ({ status, value }) => {
                    return {
                      name: status,
                      value:
                        round((value / calcRateOfCandidateStatus(filteredCandidates, selectedYear).total) * 100, 1) +
                        '%',
                    }
                  },
                }}
                statistic={{
                  title: {
                    offsetY: -4,
                    style: {
                      fontFamily: 'Montserrat-Regular',
                      fontSize: '14px',
                    },
                    content: 'Candidates By',
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

export default CandidatesOverview
