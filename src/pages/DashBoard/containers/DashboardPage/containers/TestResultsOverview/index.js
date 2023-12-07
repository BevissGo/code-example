import { Empty, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Column, Pie } from '@ant-design/plots'
import { round } from 'lodash'

import { fetchCustomTestScoreList } from 'api/business/customTestScore.api'
import { fetchCustomizedTestList } from 'api/business/customizedTest.api'
import { getAllCandidates } from 'api/business/userPositionCampaign.api'
import { fetchCampaignList } from 'api/business/campaign.api'
import { getAllPositions } from 'api/business/position.api'

import Section from '../../components/Section'
import ChartWrapper from '../../components/ChartWrapper'
import { convertToComparisonPassedFailedData, convertToTotalPassedAndFailed } from '../../helper'

import './style.scss'

function TestResultsOverview() {
  const [candidates, setCandidates] = useState([])
  const [customTestList, setCustomTestList] = useState([])
  const [customTestScoreList, setCustomTestScoreList] = useState([])
  const [comparisonPassedAndFailData, setComparisonPassedAndFailData] = useState([])
  const [filteredCustomTestScores, setFilteredCustomTestScores] = useState([])
  const [campaignOptions, setCampaignOption] = useState([])
  const [selectedCampaigns, setSelectedCampaigns] = useState([])
  const [positions, setPositions] = useState([])
  const [selectedPositions, setSelectedPositions] = useState([])
  const [totalPassedAndFailedData, setTotalPassedAndFailedData] = useState([])
  const [filteredCandidates, setFilteredCandidates] = useState([])

  const { mutate: getCampaignsMutate, isLoading: getCampaignsLoading } = useMutation(() => fetchCampaignList(), {
    onSuccess: (data) => {
      setCampaignOption(
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

  const { mutate: getCustomTestScoreListMutate, isLoading: getCustomTestScoreListLoading } = useMutation(
    () => fetchCustomTestScoreList(),
    {
      onSuccess: (data) => {
        setCustomTestScoreList(data)
      },
    },
  )

  const { mutate: getCustomTestListMutate, isLoading: getCustomTestListLoading } = useMutation(
    () => fetchCustomizedTestList(),
    {
      onSuccess: (data) => {
        setCustomTestList(data)
      },
    },
  )

  const { mutate: getCandidateListMutate, isLoading: getCandidateListLoading } = useMutation(() => getAllCandidates(), {
    onSuccess: (data) => {
      setCandidates(data?.map((e) => e.user))
    },
  })

  useEffect(() => {
    getCampaignsMutate()
    getPostitionsMutate()
    getCustomTestScoreListMutate()
    getCustomTestListMutate()
    getCandidateListMutate()
  }, [
    getCampaignsMutate,
    getCandidateListMutate,
    getCustomTestListMutate,
    getCustomTestScoreListMutate,
    getPostitionsMutate,
  ])

  useEffect(() => {
    if (selectedCampaigns.length && selectedPositions.length) {
      setFilteredCustomTestScores(
        customTestScoreList?.filter(
          (customTest) =>
            selectedCampaigns.includes(customTest.campaignId) && selectedPositions.includes(customTest.positionId),
        ),
      )

      setFilteredCandidates(
        candidates?.filter(
          (candidate) =>
            selectedCampaigns.includes(candidate.campaignId.Id) && selectedPositions.includes(candidate.positionId.Id),
        ),
      )
    } else if (selectedCampaigns.length && !selectedPositions.length) {
      setFilteredCustomTestScores(
        customTestScoreList?.filter((customTest) => selectedCampaigns.includes(customTest.campaignId)),
      )

      setFilteredCandidates(candidates?.filter((candidate) => selectedCampaigns.includes(candidate.campaignId.Id)))
    } else if (!selectedCampaigns.length && selectedPositions.length) {
      setFilteredCustomTestScores(
        customTestScoreList?.filter((customTest) => selectedPositions.includes(customTest.positionId)),
      )

      setFilteredCandidates(candidates?.filter((candidate) => selectedPositions.includes(candidate.positionId.Id)))
    } else {
      setFilteredCustomTestScores(customTestScoreList)
      setFilteredCandidates(candidates)
    }
  }, [candidates, customTestScoreList, selectedCampaigns, selectedPositions])

  useEffect(() => {
    setComparisonPassedAndFailData(convertToComparisonPassedFailedData(customTestList, filteredCustomTestScores))
  }, [customTestList, filteredCustomTestScores])

  useEffect(() => {
    setTotalPassedAndFailedData(convertToTotalPassedAndFailed(filteredCandidates))
  }, [filteredCandidates])

  const handleSelectCampaigns = (values) => {
    setSelectedCampaigns(values.map(({ value }) => value))
  }

  const handleSelectPositions = (values) => {
    setSelectedPositions(values.map(({ value }) => value))
  }

  return (
    <Spin
      spinning={
        getCampaignsLoading ||
        getPostitionsLoading ||
        getCustomTestScoreListLoading ||
        getCustomTestListLoading ||
        getCandidateListLoading
      }
    >
      <Section
        title='Test Results Overview'
        campaignOptions={campaignOptions}
        positionOptions={positions}
        handleSelectCampaigns={handleSelectCampaigns}
        handleSelectPositions={handleSelectPositions}
        hasDatePicker={false}
        hasFilterYear={false}
      >
        <div className='test-results-overview'>
          <div className='test-results-overview__section1'>
            {!candidates?.length ? (
              <Empty description='No candidates' />
            ) : (
              <Pie
                style={{ width: '100%' }}
                data={totalPassedAndFailedData}
                angleField='quantity'
                colorField='result'
                color={['#D7EBFF', '#6BB5FF']}
                radius={1}
                innerRadius={0.6}
                label={false}
                legend={false}
                tooltip={{
                  formatter: ({ result, quantity }) => {
                    return {
                      name: result,
                      value: round((quantity / filteredCandidates?.length) * 100, 1) + '%',
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
                    content: 'Total',
                  },
                  content: {
                    offsetY: 4,
                    style: {
                      fontFamily: 'Montserrat-Bold',
                      fontSize: '16px',
                    },
                    content: 'FAILED & PASSED',
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
          <div className='test-results-overview__section2'>
            <ChartWrapper title='Comparison between Passed and Failed'>
              {!customTestScoreList?.length ? (
                <Empty description='No custom tests' />
              ) : (
                <Column
                  style={{ width: '100%' }}
                  data={comparisonPassedAndFailData}
                  isStack={true}
                  xField='name'
                  yField='quantity'
                  seriesField='result'
                  color={['#D7EBFF', '#6BB5FF']}
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
                  legend={{
                    position: 'top',
                    marker: {
                      symbol: 'circle',
                    },
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
        </div>
      </Section>
    </Spin>
  )
}

export default TestResultsOverview
