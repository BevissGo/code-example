import React from 'react'
import { capitalize } from 'lodash'
import { Col, Row } from 'antd'

import { formatDate } from 'utils/formatDate'

import './style.scss'

const CampaignInformationDetail = ({ campaignData }) => {
  const { recruiter, purpose, range, startDate, endDate } = campaignData

  return (
    <div className='campaign-information-detail'>
      <Row justify='space-between'>
        <Col span={5}>
          <p className='campaign-information-detail__title'>Recruiter</p>
          <p className='campaign-information-detail__content'>{recruiter ?? '--'}</p>
        </Col>
        <Col span={5}>
          <p className='campaign-information-detail__title'>Purpose</p>
          <p className='campaign-information-detail__content'>{purpose ?? '--'}</p>
        </Col>
        <Col span={5}>
          <p className='campaign-information-detail__title'>Range</p>
          <p className='campaign-information-detail__content'>{capitalize(range) || '--'}</p>
        </Col>
        <Col span={5}>
          <p className='campaign-information-detail__title'>Start date</p>
          <p className='campaign-information-detail__content'>{formatDate(startDate)}</p>
        </Col>
        <Col span={2.5}>
          <p className='campaign-information-detail__title'>End date</p>
          <p className='campaign-information-detail__content'>{formatDate(endDate)}</p>
        </Col>
      </Row>
    </div>
  )
}

export default CampaignInformationDetail
