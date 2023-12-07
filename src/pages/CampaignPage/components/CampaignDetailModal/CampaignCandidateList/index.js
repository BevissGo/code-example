import React, { useState } from 'react'
import { Avatar, Col, Row, Spin } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'

import CustomTable from 'components/CustomTable'
import { GET_CAMPAIGN_DETAIL, GET_POSITION_CAMPAIGN_RESULT } from 'api/req'
import { fetchCampaignDetail, fetchPositionCampaignResult } from 'api/business/campaign.api'
import { toastifyNotify } from 'helpers'

import ResultPassAndFail from '../../ResultPassAndFail'
import CampaignResultDetailModal from '../../CampaignResultDetailModal'

import './style.scss'

function CampaignCandidateList({ campaignId, positionId }) {
  const [isOpenCandidateResultDetail, setIsOpenCandidateResultDetail] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState({})

  const { data: campaignDetail, isFetching: campaignDetailFetching } = useQuery(
    [GET_CAMPAIGN_DETAIL, { campaignId }],
    () => fetchCampaignDetail(campaignId),
    {
      onError: (error) => {
        toastifyNotify('error', error?.message ?? `Failed to fetch campaign detail ID ${campaignId}.`)
      },
      initialData: {},
    },
  )

  const { data: positionCampaignResult, isFetching: positionCampaignResultFetching } = useQuery(
    [GET_POSITION_CAMPAIGN_RESULT, { campaignId, positionId }],
    () => fetchPositionCampaignResult(campaignId, positionId),
    {
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to fetch position result of campaign.')
      },
    },
  )

  const positionDetail = campaignDetail?.data?.positions?.find((position) => {
    return position?.positionId?.Id === positionId
  })

  const categoryTest = positionDetail?.categoryTest ?? []
  const uploadTest = positionDetail?.uploadTest ?? []
  const customTestList = positionDetail?.testList ?? []

  const iqColumn = {
    title: `IQ (≥ ${positionDetail?.iqScore ?? 0})`,
    dataIndex: 'iqResult',
    align: 'center',
    render: (data) => {
      return <Row align='center'>{data?.score ?? '--'}</Row>
    },
  }

  const eqColumn = {
    title: `EQ (>= ${positionDetail?.eqScore?.min ?? 0})`,
    dataIndex: 'eqResult',
    align: 'center',
    render: (data) => {
      return <Row align='center'>{data?.score ?? '--'}</Row>
    },
  }

  const discColumn = {
    title: 'DiSC',
    dataIndex: 'discResult',
    align: 'center',
    render: (data) => <span>{data?.profilePattern?.name ?? '--'}</span>,
  }

  const brainColumn = {
    title: 'Brain',
    dataIndex: 'brainResult',
    align: 'center',
    render: (data) => (
      <span>
        {data?.sideOfBrain === 'all'
          ? 'All'
          : data?.sideOfBrain === 'L'
          ? 'Left'
          : data?.sideOfBrain === 'R'
          ? 'Right'
          : '--'}
      </span>
    ),
  }

  const passColumn = {
    title: 'Final',
    align: 'center',
    render: (_, record) => {
      const resultList = record.customTestResult?.map((result) => result.score >= result.fitCorrect)
      const finalResult = [
        record.iqResult ? record.iqResult?.pass : true,
        record.eqResult ? record.eqResult?.pass : true,
        record.discResult ? record.discResult?.pass : true,
        record.brainResult ? record.brainResult?.pass : true,
        ...resultList,
      ].every(Boolean)

      return (
        <Row align='center'>
          <ResultPassAndFail isPass={finalResult} />
        </Row>
      )
    },
  }

  const viewCv = {
    title: () => <>CV</>,
    dataIndex: 'attachCv',
    align: 'center',
    render: (attachCv) => (
      <Row align='center'>
        {attachCv?.path ? (
          <DownloadOutlined
            onClick={(e) => {
              e.stopPropagation()
              window.open(attachCv.path)
            }}
          />
        ) : (
          '--'
        )}
      </Row>
    ),
  }

  const viewCoverLetter = {
    title: () => <>Cover Letter</>,
    dataIndex: 'attachCoverLetter',
    align: 'center',
    render: (attachCoverLetter) => (
      <Row align='center'>
        {attachCoverLetter?.path ? (
          <DownloadOutlined
            onClick={(e) => {
              e.stopPropagation()
              window.open(attachCoverLetter.path)
            }}
          />
        ) : (
          '--'
        )}
      </Row>
    ),
  }

  const columns = [
    {
      title: 'No.',
      align: 'center',
      render: (_text, _record, index) => <span>{index + 1}</span>,
    },
    {
      title: 'Candidate',
      dataIndex: 'user',
      render: (data) => (
        <Row justify='space-between' style={{ minWidth: 240 }}>
          <Col span={3}>
            <Avatar size={40} src={data?.avatar} />
          </Col>
          <Col span={17}>
            <Row className='campaign-candidate-list__username'>{data?.name ?? '--'}</Row>
            <Row className='campaign-candidate-list__email'>{data?.email ?? '--'}</Row>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Phone Number',
      dataIndex: 'user',
      align: 'center',
      render: (data) => <span>{data?.phone ?? '--'}</span>,
    },
  ]

  if (categoryTest.includes('iq_score')) {
    columns.push(iqColumn)
  }

  if (categoryTest.includes('eq_score')) {
    columns.push(eqColumn)
  }

  if (categoryTest.includes('disc_score')) {
    columns.push(discColumn)
  }

  if (categoryTest.includes('brain_score')) {
    columns.push(brainColumn)
  }

  if (customTestList.length > 0) {
    customTestList.forEach((test) => {
      columns.push({
        title: test.testId?.testName,
        dataIndex: 'customTestResult',
        align: 'center',
        render: (data) => {
          const testResult = data?.find((e) => e.testId === test.testId?.Id)

          let isPass

          if (testResult) {
            isPass = testResult.score >= testResult.fitCorrect
          }

          return <Row align='center'>{<ResultPassAndFail isPass={isPass} />}</Row>
        },
      })
    })
  }

  columns.push(passColumn)

  if (uploadTest.includes('cv')) {
    columns.push(viewCv)
  }

  if (uploadTest.includes('cover_letter')) {
    columns.push(viewCoverLetter)
  }

  const handleCloseCampaignResultDetailModal = () => {
    setIsOpenCandidateResultDetail(false)
    setSelectedCandidate({})
  }
  return (
    <Spin spinning={campaignDetailFetching || positionCampaignResultFetching} className='campaign-candidate-list'>
      <CustomTable
        rowKey={(record) => record.Id}
        columns={columns}
        dataSource={positionCampaignResult?.data ?? []}
        handleRowClick={(record) => {
          setSelectedCandidate(record)
          setIsOpenCandidateResultDetail(true)
        }}
      />

      <CampaignResultDetailModal
        isOpenCandidateResultDetail={isOpenCandidateResultDetail}
        selectedCandidate={selectedCandidate}
        positionDetail={positionDetail}
        customTestList={customTestList}
        handleCloseCampaignResultDetailModal={handleCloseCampaignResultDetailModal}
      />
    </Spin>
  )
}

export default CampaignCandidateList
