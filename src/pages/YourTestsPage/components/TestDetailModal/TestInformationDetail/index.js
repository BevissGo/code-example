import React from 'react'
import { Col, Row } from 'antd'

import './style.scss'

function TestInformationDetail({ testData }) {
  const { testName, durationTime, description } = testData

  return (
    <div className='test-information-detail'>
      <Row justify='space-between'>
        <Col span={8}>
          <p className='test-information-detail__title'>Test name</p>
          <p className='test-information-detail__content'>{testName ?? '--'}</p>
        </Col>
        <Col span={8}>
          <p className='test-information-detail__title'>Duration (mins)</p>
          <p className='test-information-detail__content'>{durationTime ?? 'Unlimited'}</p>
        </Col>
        <Col span={8}>
          <p className='test-information-detail__title'>Description</p>
          <p className='test-information-detail__content'>{description ?? '--'}</p>
        </Col>
      </Row>
    </div>
  )
}

export default TestInformationDetail
