import React, { useState } from 'react'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Col, Row, Table } from 'antd'
import { useQuery } from '@tanstack/react-query'

import CustomTable from 'components/CustomTable'
import { countCandidatesInPositionWithCampaignId } from 'api/business/userPositionCampaign.api'
import { toastifyNotify } from 'helpers'

import CampaignDetailLink from '../CampaignDetailLink'

import './style.scss'

const CampaignPositionDetail = ({ campaignPositionData, campaignId, setSelectedPosition }) => {
  const positionIdList = campaignPositionData?.map((e) => e.positionId.Id)

  const [copied, setCopied] = useState('')

  const { data: numberOfCandidatesInCampaignByPosition } = useQuery(
    ['GET_NUMBER_OF_CANDIDATES_IN_CAMPAIGN_BY_POSITION', campaignId, campaignPositionData],
    () => countCandidatesInPositionWithCampaignId(campaignId, positionIdList),
    {
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to Get number of candidates in campaign by position list.')
      },
      initialData: [],
      enabled: !!campaignId,
    },
  )

  const columns = [
    {
      title: <span>No.</span>,
      render: (_text, _record, index) => <span>{index + 1}</span>,
    },
    {
      title: <span>Position</span>,
      dataIndex: 'positionId',
      render: (positionId) => <span>{positionId?.name ?? '--'}</span>,
    },
    {
      title: <span>Applied/Requested</span>,
      dataIndex: 'amount',
      align: 'center',
      render: (amount, record, index) => {
        return (
          <span>
            {`${
              numberOfCandidatesInCampaignByPosition[index]?.positionId === record.positionId.Id
                ? numberOfCandidatesInCampaignByPosition[index]?.numberOfCandidates
                : 0
            }/${amount}` ?? '--'}
          </span>
        )
      },
    },
    {
      title: <span>Upload CV</span>,
      dataIndex: 'requireAttachCv',
      align: 'center',
      render: (requireAttachCv, record) => (
        <span>
          {record.uploadTest?.includes('cv') && requireAttachCv
            ? 'Required'
            : record.uploadTest?.includes('cv') && !requireAttachCv
            ? 'Optional'
            : '--'}
        </span>
      ),
    },
    {
      title: <span>Upload Cover Letter</span>,
      dataIndex: 'requireAttachCoverLetter',
      align: 'center',
      render: (requireAttachCoverLetter, record) => (
        <span>
          {record.uploadTest?.includes('cover_letter') && requireAttachCoverLetter
            ? 'Required'
            : record.uploadTest?.includes('cover_letter') && !requireAttachCoverLetter
            ? 'Optional'
            : '--'}
        </span>
      ),
    },
    {
      title: <span>Tests</span>,
      dataIndex: 'categoryTest',
      align: 'center',
      render: (categoryTest, record) => <span>{categoryTest.length + record.testList.length}</span>,
    },
    Table.EXPAND_COLUMN,
  ]

  const expandedRowRender = (record) => {
    return (
      <Row span={24} justify='end'>
        {record?.categoryTest?.includes('iq_score') && (
          <div className='campaign-position-detail__test-link'>
            <CampaignDetailLink
              copied={copied}
              setCopied={setCopied}
              testName={'IQ'}
              linkTest={`${window.location.origin}/iq-test-campaign/${campaignId}/${record?.positionId?.Id}`}
            />
          </div>
        )}
        {record?.categoryTest?.includes('eq_score') && (
          <div className='campaign-position-detail__test-link'>
            <CampaignDetailLink
              copied={copied}
              setCopied={setCopied}
              testName={'EQ'}
              linkTest={`${window.location.origin}/eq-test-campaign/${campaignId}/${record?.positionId?.Id}`}
            />
          </div>
        )}
        {record?.categoryTest?.includes('brain_score') && (
          <div className='campaign-position-detail__test-link'>
            <CampaignDetailLink
              copied={copied}
              setCopied={setCopied}
              testName={'Brain'}
              linkTest={`${window.location.origin}/brain-test-campaign/${campaignId}/${record?.positionId?.Id}`}
            />
          </div>
        )}
        {record?.categoryTest?.includes('disc_score') && (
          <div className='campaign-position-detail__test-link'>
            <CampaignDetailLink
              copied={copied}
              setCopied={setCopied}
              testName={'DiSC'}
              linkTest={`${window.location.origin}/disc-test-campaign/${campaignId}/${record?.positionId?.Id}`}
            />
          </div>
        )}
        {record?.testList?.map((test, index) => (
          <div key={index} className='campaign-position-detail__test-link'>
            <CampaignDetailLink
              copied={copied}
              setCopied={setCopied}
              testName={test.testId.testName}
              linkTest={`${window.location.origin}/custom-test-campaign/${campaignId}/${record?.positionId?.Id}/${test.testId.Id}`}
            />
          </div>
        ))}
      </Row>
    )
  }

  const handleRowClick = (position) => {
    setSelectedPosition(position)
  }

  return (
    <Col className='campaign-position-detail'>
      <CustomTable
        rowKey={(record) => record.positionId.Id}
        columns={columns}
        dataSource={campaignPositionData}
        expandable={{
          expandedRowRender,
          defaultExpandAllRows: false,
          defaultExpandedRowKeys: [],
          expandRowByClick: true,
          expandIcon: ({ expanded, onExpand, record }) => {
            return (
              <Col
                className='campaign-position-detail__expanded-text'
                onClick={(e) => {
                  onExpand(record, e)
                }}
              >
                <Row align='middle'>
                  Link
                  {expanded ? (
                    <UpOutlined style={{ fontSize: 10, marginLeft: 4 }} />
                  ) : (
                    <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
                  )}
                </Row>
              </Col>
            )
          },
        }}
        handleRowClick={handleRowClick}
      />
    </Col>
  )
}

export default CampaignPositionDetail
